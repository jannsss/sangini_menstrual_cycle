import React from 'react';
import { Calendar, Activity, Utensils, BarChart3, TrendingUp, Database } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'symptoms', name: 'Symptoms', icon: Activity },
    { id: 'nutrition', name: 'Nutrition', icon: Utensils },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'backup', name: 'Data', icon: Database }
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;