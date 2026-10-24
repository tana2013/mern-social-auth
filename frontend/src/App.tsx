import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from './store';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export const App: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? <Dashboard /> : <Login />;
};