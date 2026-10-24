import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';

export const OAuthSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const userString = searchParams.get('user');

        if (token && userString) {
            const user = JSON.parse(decodeURIComponent(userString));
            // Dispatch payload to Redux and sync localStorage
            dispatch(setCredentials({ user, token }));
            navigate('/dashboard');
        } else {
            navigate('/login?error=oauth_processing_failed');
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-2 mb-4" />
                <p className="text-slate-400 font-medium">Securing profile handshake session state...</p>
            </div>
        </div>
    );
};
