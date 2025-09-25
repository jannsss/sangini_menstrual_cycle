import React from 'react';
import { Flower, Shield, Wifi, WifiOff, LogOut } from 'lucide-react';
import { User } from '../types';
import Notifications from './Notifications';
import { PeriodEntry } from '../types';

interface HeaderProps {
  user: User;
  periods: PeriodEntry[];
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, periods, onLogout }) => {
  const isOnline = navigator.onLine;

  return (
    <header className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flower className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Sangini</h1>
              <p className="text-rose-100 text-sm">Your Menstrual Wellness Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Welcome, {user.name}</p>
              <p className="text-xs text-rose-100">{user.email}</p>
            </div>
            <Notifications periods={periods} />
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isOnline ? 'bg-green-500/20' : 'bg-yellow-500/20'
            }`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline Ready'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;