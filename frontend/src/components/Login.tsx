import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../store/services/authApi';
import { setCredentials } from '../store/slices/authSlice';
import { SocialButtons } from './SocialButtons';

export const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            let response;
            if (isRegister) {
                response = await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }).unwrap();
            } else {
                response = await login({
                    email: formData.email,
                    password: formData.password,
                }).unwrap();
            }

            // Commit user payload and raw token straight to RTK State + LocalStorage
            dispatch(setCredentials(response));
        } catch (err: any) {
            setErrorMsg(err?.data?.message || 'Authentication failed. Please check your credentials.');
        }
    };

    const isLoading = isLoggingIn || isRegistering;

    return (
        <div className="min-h-screen bg-slate-900 grid items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        {isRegister ? 'Create an Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        {isRegister ? 'Sign up to access the authorization live deck' : 'Sign in to monitor live system metrics'}
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm font-medium animate-shake">
                        {errorMsg}
                    </div>
                )}

                {/* <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="johndoe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isRegister ? (
                            'Register Account'
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form> */}
                
                <SocialButtons/>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setErrorMsg(null);
                        }}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition focus:outline-none"
                    >
                        {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign_Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};
