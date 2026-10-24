import dotenv from 'dotenv';
dotenv.config();

export const OAUTH_CONFIG = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/google',
        tokenUrl: 'https://googleapis.com',
        userUrl: 'https://googleapis.com',
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/github',
        tokenUrl: 'https://github.com',
        userUrl: 'https://github.com',
    },
    facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/facebook',
        tokenUrl: 'https://facebook.com',
        userUrl: 'https://facebook.com',
    },
    instagram: {
        clientId: process.env.INSTAGRAM_CLIENT_ID!,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/instagram',
        tokenUrl: 'https://instagram.com',
        userUrl: 'https://instagram.com',
    },
    twitter: {
        clientId: process.env.TWITTER_CLIENT_ID!, // OAuth 2.0 Client ID
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/twitter',
        tokenUrl: 'https://twitter.com',
        userUrl: 'https://twitter.com',
    },
    tiktok: {
        clientKey: process.env.TIKTOK_CLIENT_KEY!,
        clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
        redirectUri: 'http://localhost:5000/api/auth/callback/tiktok',
        tokenUrl: 'https://tiktokapis.com',
        userUrl: 'https://tiktokapis.com',
    }
};
