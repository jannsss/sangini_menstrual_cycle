import React, { useState } from 'react';
import { PeriodEntry, SymptomEntry, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Auth from './components/Auth';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PeriodCalendar from './components/PeriodCalendar';
import SymptomTracker from './components/SymptomTracker';
import NutritionGuide from './components/NutritionGuide';
import CycleAnalytics from './components/CycleAnalytics';
import DataBackup from './components/DataBackup';
import Chatbot from './components/Chatbot';

function App() {
  const [user, setUser] = useLocalStorage<User | null>('sangini-user', null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [periods, setPeriods] = useLocalStorage<PeriodEntry[]>('sangini-periods', []);
  const [symptoms, setSymptoms] = useLocalStorage<SymptomEntry[]>('sangini-symptoms', []);

  // Service Worker registration for offline functionality
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, but app still works
      });
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard periods={periods} />;
      case 'calendar':
        return <PeriodCalendar periods={periods} setPeriods={setPeriods} />;
      case 'symptoms':
        return <SymptomTracker symptoms={symptoms} setSymptoms={setSymptoms} />;
      case 'nutrition':
        return <NutritionGuide periods={periods} />;
      case 'analytics':
        return <CycleAnalytics periods={periods} />;
      case 'backup':
        return <DataBackup periods={periods} symptoms={symptoms} setPeriods={setPeriods} setSymptoms={setSymptoms} />;
      default:
        return <Dashboard periods={periods} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Header user={user} periods={periods} onLogout={handleLogout} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderActiveTab()}
      </main>
      
      {/* Chatbot */}
      <Chatbot userId={user.id} />
      
      {/* Privacy Notice Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Data stored locally on your device</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No data sent to external servers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Works offline in rural areas</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Sangini respects your privacy. All menstrual data remains on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;