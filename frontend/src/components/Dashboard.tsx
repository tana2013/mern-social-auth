import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { logout } from '../store/slices/authSlice';

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [liveActiveCount, setLiveActiveCount] = useState<number>(0);

    useEffect(() => {
        if (!token) return;

        // Connect securely to our native WebSocket setup via query token parsing
        const ws = new WebSocket(`ws://localhost:5000?token=${token}`);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ACTIVE_USERS_COUNT') {
                setLiveActiveCount(data.count);
            }
        };

        return () => ws.close();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center">
                <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome, {user?.username}!</h1>
                <p className="text-slate-400 mb-6">{user?.email}</p>

                <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 mb-6">
                    <div className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">System Live Presence</div>
                    <div className="text-4xl font-black text-indigo-300 mt-1">{liveActiveCount}</div>
                    <div className="text-xs text-indigo-400/70 mt-1">Users Authorized Concurrent Session</div>
                </div>

                <button
                    onClick={() => dispatch(logout())}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 transition duration-150 rounded-xl font-medium shadow-md"
                >
                    Disconnect & Log Out
                </button>
            </div>
        </div>
    );
};
