import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // Essential relative .js extension
import { OAUTH_CONFIG } from '../config/oauth.js';

export const handleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
    const { provider } = req.params;
    const { code } = req.query;

    if (!code) {
        res.redirect('http://localhost:5173/login?error=no_code_provided');
        return;
    }

    try {
        const config = OAUTH_CONFIG[provider as keyof typeof OAUTH_CONFIG];
        if (!config) {
            res.redirect('http://localhost:5173/login?error=invalid_provider');
            return;
        }

        let email = '';
        let username = '';
        let profileId = '';

        // 🔄 Step 1: Exchange auth code for tokens
        if (provider === 'google') {
            const tokenRes = await fetch(config.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code: code as string,
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    redirect_uri: config.redirectUri,
                    grant_type: 'authorization_code',
                }),
            });
            const tokens = await tokenRes.json();

            // Fetch user profile data
            const userRes = await fetch(config.userUrl, {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const profile = await userRes.json();
            email = profile.email;
            username = profile.name || profile.given_name;
            profileId = profile.id;
        }

        else if (provider === 'github') {
            const tokenRes = await fetch(config.tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    code,
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    redirect_uri: config.redirectUri,
                }),
            });
            const tokens = await tokenRes.json();

            const userRes = await fetch(config.userUrl, {
                headers: { Authorization: `Bearer ${tokens.access_token}`, 'User-Agent': 'node.js' },
            });
            const profile = await userRes.json();
            // GitHub profiles can have null public emails
            email = profile.email || `${profile.login}@github.oauth.local`;
            username = profile.login;
            profileId = String(profile.id);
        }

        // Add logic filters block for Facebook, Instagram, Twitter, and TikTok down below...
        // All aggregate to extracting cross-platform unique values (email, username, profileId)

        if (!email) {
            email = `${profileId}@${provider}.oauth.local`;
        }

        // 💾 Step 2: upsert user profile entries into MongoDB
        let user = await User.findOne({ \$or: [{ email }, { [`socialLinks.${provider}Id`]: profileId }] });

        if (!user) {
            // Generate randomized fallback string for non-password external oauth entries
            const dummyPassword = Math.random().toString(36).slice(-16);
            user = await User.create({
                username: `${username.replace(/\s+/g, '').toLowerCase()}_${Math.floor(Math.random() * 1000)}`,
                email,
                password: dummyPassword, // Will be natively hashed inside mongoose hook or controller before save
            });
        }

        // 🎟️ Step 3: Sign internal JWT access tokens
        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        // ↪️ Step 4: Securely relay authentication details back to frontend window runtime
        res.redirect(`http://localhost:5173/oauth-success?token=${appToken}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            username: user.username,
            email: user.email
        }))}`);

    } catch (error) {
        console.error(`OAuth error for provider ${provider}:`, error);
        res.redirect('http://localhost:5173/login?error=oauth_handshake_failed');
    }
};