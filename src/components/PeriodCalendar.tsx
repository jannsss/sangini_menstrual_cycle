import React, { useState } from 'react';
import { PeriodEntry } from '../types';
import { Plus, Edit, Trash2, BarChart3, Calendar as CalendarIcon } from 'lucide-react';
import PeriodForm from './PeriodForm';

interface PeriodCalendarProps {
  periods: PeriodEntry[];
  setPeriods: React.Dispatch<React.SetStateAction<PeriodEntry[]>>;
}

const PeriodCalendar: React.FC<PeriodCalendarProps> = ({ periods, setPeriods }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PeriodEntry | null>(null);

  const handleAddPeriod = (period: PeriodEntry) => {
    setPeriods(prev => [...prev, period]);
    setShowForm(false);
  };

  const handleEditPeriod = (period: PeriodEntry) => {
    setPeriods(prev => prev.map(p => p.id === period.id ? period : p));
    setEditingPeriod(null);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  };

  const sortedPeriods = periods.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light': return 'bg-pink-200 text-pink-800';
      case 'medium': return 'bg-rose-300 text-rose-800';
      case 'heavy': return 'bg-red-400 text-red-900';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar View Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6" />
            <span>Period Calendar & Analytics</span>
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <span>Heavy Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-rose-300 rounded-full"></div>
              <span>Medium Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-200 rounded-full"></div>
              <span>Light Flow</span>
            </div>
          </div>
        </div>
        
        {periods.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="bg-rose-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-rose-600 mb-1">
                {periods.length}
              </div>
              <p className="text-sm text-gray-600">Total Periods</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(periods.reduce((acc, p) => {
                  const start = new Date(p.startDate);
                  const end = new Date(p.endDate);
                  return acc + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                }, 0) / periods.length)}
              </div>
              <p className="text-sm text-gray-600">Avg Period Length</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {periods.filter(p => p.flow === 'heavy').length}
              </div>
              <p className="text-sm text-gray-600">Heavy Flow Days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {periods.reduce((acc, p) => acc + p.symptoms.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Symptoms Tracked</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Period History</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Period</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PeriodForm
              onSubmit={handleAddPeriod}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {editingPeriod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PeriodForm
              period={editingPeriod}
              onSubmit={handleEditPeriod}
              onCancel={() => setEditingPeriod(null)}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sortedPeriods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No periods tracked yet. Add your first period to get started!</p>
          </div>
        ) : (
          sortedPeriods.map((period) => {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            return (
              <div key={period.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {startDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFlowColor(period.flow)}`}>
                        {period.flow} flow
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span>{endDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{duration} days</span>
                      </div>
                      {period.symptoms.length > 0 && (
                        <div>
                          <span className="font-medium">Symptoms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {period.symptoms.map((symptom, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPeriod(period)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePeriod(period.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PeriodCalendar;