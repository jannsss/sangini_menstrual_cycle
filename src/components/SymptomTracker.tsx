import React, { useState } from 'react';
import { SymptomEntry } from '../types';
import { availableSymptoms } from '../data/symptomsData';
import { Plus, Calendar, TrendingUp } from 'lucide-react';

interface SymptomTrackerProps {
  symptoms: SymptomEntry[];
  setSymptoms: React.Dispatch<React.SetStateAction<SymptomEntry[]>>;
}

const SymptomTracker: React.FC<SymptomTrackerProps> = ({ symptoms, setSymptoms }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState('');

  const handleSymptomToggle = (symptomName: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomName)) {
        const newSymptoms = prev.filter(s => s !== symptomName);
        const newSeverity = { ...severity };
        delete newSeverity[symptomName];
        setSeverity(newSeverity);
        return newSymptoms;
      } else {
        setSeverity(prev => ({ ...prev, [symptomName]: 3 }));
        return [...prev, symptomName];
      }
    });
  };

  const handleSeverityChange = (symptomName: string, value: number) => {
    setSeverity(prev => ({ ...prev, [symptomName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    const newEntry: SymptomEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      symptoms: selectedSymptoms,
      severity,
      notes: notes.trim() || undefined
    };

    setSymptoms(prev => [...prev, newEntry]);
    setSelectedSymptoms([]);
    setSeverity({});
    setNotes('');
  };

  const todaySymptoms = symptoms.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const recentSymptoms = symptoms
    .filter(s => new Date(s.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Plus className="h-6 w-6" />
          <span>Track Today's Symptoms</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Symptoms
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSymptoms.map((symptom) => (
                <div key={symptom.id} className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom.name)}
                      onChange={() => handleSymptomToggle(symptom.name)}
                      className="text-rose-500 focus:ring-rose-500 rounded"
                    />
                    <span className="text-lg">{symptom.icon}</span>
                    <span className="text-gray-700">{symptom.name}</span>
                  </label>
                  
                  {selectedSymptoms.includes(symptom.name) && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Severity (1 = Mild, 5 = Severe)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={severity[symptom.name] || 3}
                        onChange={(e) => handleSeverityChange(symptom.name, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Mild</span>
                        <span className="font-medium">{severity[symptom.name] || 3}</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional observations or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={selectedSymptoms.length === 0}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Save Symptoms
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span>Recent Symptoms</span>
        </h3>

        {recentSymptoms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No symptoms tracked recently</p>
        ) : (
          <div className="space-y-4">
            {recentSymptoms.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-800">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.symptoms.map((symptom, index) => (
                    <span key={index} className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm">
                      {symptom} ({entry.severity[symptom]}/5)
                    </span>
                  ))}
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600 italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;