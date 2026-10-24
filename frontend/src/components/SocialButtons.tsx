import React from 'react';
import {
    FaGoogle,
    FaGithub,
    FaFacebook,
    FaInstagram,
    FaTiktok,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialProviders = [
    { id: 'google', name: 'Google', icon: <FaGoogle />, bgColor: 'hover:bg-red-50 text-red-600 border-red-500' },
    { id: 'github', name: 'GitHub', icon: <FaGithub />, bgColor: 'hover:bg-gray-100 text-gray-900 border-gray-500' },
    { id: 'facebook', name: 'Facebook', icon: <FaFacebook />, bgColor: 'hover:bg-blue-50 text-blue-600 border-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: <FaInstagram />, bgColor: 'hover:bg-pink-50 text-pink-600 border-pink-500' },
    { id: 'tiktok', name: 'Tiktok', icon: <FaTiktok />, bgColor: 'hover:bg-gray-50 text-black border-gray-500' },
    { id: 'twitter', name: 'X', icon: <FaXTwitter />, bgColor: 'hover:bg-gray-50 text-black border-gray-500' },
];
const triggerOAuthFlow = (providerId: string) => {
    const rootUrls: Record<string, string> = {
        google: 'https://accounts.google.com/o/oauth2/v2/auth', 
        github: 'https://github.com',    
        facebook: 'https://facebook.com',
        instagram: 'https://api.instagram.com/oauth/authorize',
        tiktok: 'https://www.tiktok.com/v2/auth/authorize/',
        twitter: 'https://x.com/i/oauth2/authorize',
    };

    const options: Record<string, Record<string, string>> = {
        google: {
            client_id: '62688837446-qjingvni6aace8j0ndoghf2qmo8grut0.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:5000/api/auth/callback/google',
            response_type: 'code',
            scope: 'profile email',
        },
        github: {
            client_id: 'Ov23lilkBGjuBjR3fK9N',
            redirect_uri: 'http://localhost:5000/api/auth/callback/github',
            scope: 'user:email',
        },
        facebook: {
            client_id: '1601369771663911',
            redirect_uri: 'http://localhost:5000/api/auth/callback/facebook',
            scope: 'email,public_profile',
            response_type: 'code',
        },
        instagram: {
            client_id: '1547751343824032',
            redirect_uri: 'http://localhost:5000/api/auth/callback/instagram',
            scope: 'user_profile',
            response_type: 'code',
        },
        tiktok: {
            client_key: 'awsmv5how7iqu3vs',
            redirect_uri: 'http://localhost:5000/api/auth/callback/tiktok',
            response_type: 'code',
            scope: 'user.info.basic',
        },
        twitter: {
            client_id: 'YOUR_TWITTER_OAUTH2_CLIENT_ID',
            redirect_uri: 'http://localhost:5000/api/auth/callback/twitter',
            response_type: 'code',
            scope: 'users.read tweet.read',
            code_challenge: 'challenge',
            code_challenge_method: 'plain',
        },
    };

    const baseUrl = rootUrls[providerId];
    const params = new URLSearchParams(options[providerId]);
    params.append('state', Math.random().toString(36).substring(2));

    window.location.href = `${baseUrl}?${params.toString()}`;
};

export const SocialButtons: React.FC = () => {

    return (
        <div className="mt-6">
            <div className="relative flex py-2 items-center mb-5">
                <div className="grow border-t border-slate-700"></div>
                <span className="shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Or Authorize via
                </span>
                <div className="grow border-t border-slate-700"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 p-4">
                {socialProviders.map((provider) => (
                    <button
                        key={provider.id}
                        onClick={() => triggerOAuthFlow(provider.id)} // Fixed: uses provider.id now
                        className={`flex items-center justify-center gap-2 border p-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors w-12 h-12 sm:w-auto sm:h-auto ${provider.bgColor}`}
                    >
                        {/* Icon always stays visible */}
                        <span className="text-xl">{provider.icon}</span>

                        {/* Text is hidden on mobile, inline on small screens and up */}
                        <span className="hidden sm:inline">
                            Continue with {provider.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

            // <div className="grid grid-cols-2 gap-3">
            //     {/* Google */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('google')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white text-sm font-medium rounded-xl border border-slate-600/70 transition shadow-sm group"
            //     >
            //         <FaGoogle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform duration-150" />
            //         <span>Google</span>
            //     </button>

            //     {/* GitHub */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('github')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white text-sm font-medium rounded-xl border border-slate-600/70 transition shadow-sm group"
            //     >
            //         <FaGithub className="w-4 h-4 text-slate-200 group-hover:scale-110 transition-transform duration-150" />
            //         <span>GitHub</span>
            //     </button>

            //     {/* Facebook */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('facebook')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 active:bg-[#1877F2]/30 text-[#1877F2] text-sm font-medium rounded-xl border border-[#1877F2]/20 transition group"
            //     >
            //         <FaFacebook className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-150" />
            //         <span>Facebook</span>
            //     </button>

            //     {/* Instagram */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('instagram')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-linear-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 active:from-purple-600/30 active:to-pink-600/30 text-pink-400 text-sm font-medium rounded-xl border border-pink-500/20 transition group"
            //     >
            //         <FaInstagram className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
            //         <span>Instagram</span>
            //     </button>

            //     {/* Twitter / X */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('twitter')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-black/40 hover:bg-black/60 active:bg-black/80 text-white text-sm font-medium rounded-xl border border-slate-700 transition group"
            //     >
            //         <FaXTwitter className="w-4 h-4 fill-current text-sky-400 group-hover:scale-110 transition-transform duration-150" />
            //         <span>Twitter</span>
            //     </button>

            //     {/* TikTok */}
            //     <button
            //         type="button"
            //         onClick={() => triggerOAuthFlow('tiktok')}
            //         className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#01F2E6]/5 hover:bg-[#01F2E6]/10 active:bg-[#01F2E6]/20 text-[#FE2C55] text-sm font-medium rounded-xl border border-[#FE2C55]/20 transition group"
            //     >
            //         <FaTiktok className="w-4 h-4 text-[#01F2E6] group-hover:scale-110 transition-transform duration-150" />
            //         <span>TikTok</span>
            //     </button>
            // </div>
