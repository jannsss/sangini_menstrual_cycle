import React, { useState, useEffect } from 'react';
import { Notification, PeriodEntry, CyclePrediction } from '../types';
import { Bell, X, Calendar, Heart, AlertCircle } from 'lucide-react';
import { calculateCyclePrediction } from '../utils/cycleCalculations';

interface NotificationsProps {
  periods: PeriodEntry[];
}

const Notifications: React.FC<NotificationsProps> = ({ periods }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [periods]);

  const generateNotifications = () => {
    const newNotifications: Notification[] = [];
    const prediction = calculateCyclePrediction(periods);
    
    if (prediction) {
      const nextPeriodDate = new Date(prediction.nextPeriodStart);
      const today = new Date();
      const daysUntilPeriod = Math.ceil((nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Period reminder notifications
      if (daysUntilPeriod === 3) {
        newNotifications.push({
          id: 'period-3days',
          title: 'Period Reminder',
          message: 'Your period is expected in 3 days. Time to prepare!',
          type: 'period',
          date: today.toISOString(),
          read: false
        });
      }
      
      if (daysUntilPeriod === 1) {
        newNotifications.push({
          id: 'period-tomorrow',
          title: 'Period Tomorrow',
          message: 'Your period is expected tomorrow. Make sure you have supplies ready.',
          type: 'period',
          date: today.toISOString(),
          read: false
        });
      }
      
      // Ovulation notification
      const ovulationDay = Math.floor(prediction.cycleLength / 2);
      const lastPeriodStart = new Date(periods[periods.length - 1]?.startDate);
      const daysSinceLastPeriod = Math.ceil((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastPeriod === ovulationDay) {
        newNotifications.push({
          id: 'ovulation-today',
          title: 'Ovulation Day',
          message: 'Today is your predicted ovulation day. Fertility is at its peak.',
          type: 'ovulation',
          date: today.toISOString(),
          read: false
        });
      }
    }
    
    // Health reminders
    const lastPeriod = periods[periods.length - 1];
    if (lastPeriod) {
      const daysSinceLastPeriod = Math.ceil((new Date().getTime() - new Date(lastPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastPeriod > 35 && prediction && prediction.cycleLength < 35) {
        newNotifications.push({
          id: 'late-period',
          title: 'Late Period',
          message: 'Your period is later than usual. Consider tracking symptoms or consulting a doctor.',
          type: 'health',
          date: new Date().toISOString(),
          read: false
        });
      }
    }
    
    setNotifications(newNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'period': return <Calendar className="h-5 w-5 text-rose-500" />;
      case 'ovulation': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'health': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.date).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;