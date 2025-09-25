import React, { useState } from 'react';
import { PeriodEntry } from '../types';
import { availableSymptoms } from '../data/symptomsData';
import { X } from 'lucide-react';

interface PeriodFormProps {
  period?: PeriodEntry;
  onSubmit: (period: PeriodEntry) => void;
  onCancel: () => void;
}

const PeriodForm: React.FC<PeriodFormProps> = ({ period, onSubmit, onCancel }) => {
  const [startDate, setStartDate] = useState(period?.startDate || '');
  const [endDate, setEndDate] = useState(period?.endDate || '');
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>(period?.flow || 'medium');
  const [symptoms, setSymptoms] = useState<string[]>(period?.symptoms || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPeriod: PeriodEntry = {
      id: period?.id || Date.now().toString(),
      startDate,
      endDate,
      flow,
      symptoms
    };

    onSubmit(newPeriod);
  };

  const toggleSymptom = (symptomName: string) => {
    setSymptoms(prev =>
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {period ? 'Edit Period' : 'Add Period'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Flow Intensity
          </label>
          <div className="flex space-x-4">
            {(['light', 'medium', 'heavy'] as const).map((flowOption) => (
              <label key={flowOption} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value={flowOption}
                  checked={flow === flowOption}
                  onChange={(e) => setFlow(e.target.value as 'light' | 'medium' | 'heavy')}
                  className="text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm text-gray-700 capitalize">{flowOption}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Symptoms (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableSymptoms.map((symptom) => (
              <label key={symptom.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={symptoms.includes(symptom.name)}
                  onChange={() => toggleSymptom(symptom.name)}
                  className="text-rose-500 focus:ring-rose-500 rounded"
                />
                <span className="text-sm">{symptom.icon}</span>
                <span className="text-sm text-gray-700">{symptom.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {period ? 'Update Period' : 'Add Period'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PeriodForm;