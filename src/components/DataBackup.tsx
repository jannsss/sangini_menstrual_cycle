import React from 'react';
import { PeriodEntry, SymptomEntry } from '../types';
import { Download, Upload, Database } from 'lucide-react';

interface DataBackupProps {
  periods: PeriodEntry[];
  symptoms: SymptomEntry[];
  setPeriods: React.Dispatch<React.SetStateAction<PeriodEntry[]>>;
  setSymptoms: React.Dispatch<React.SetStateAction<SymptomEntry[]>>;
}

const DataBackup: React.FC<DataBackupProps> = ({ periods, symptoms, setPeriods, setSymptoms }) => {
  const exportData = () => {
    const data = {
      periods,
      symptoms,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sangini-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.periods && Array.isArray(data.periods)) {
          setPeriods(data.periods);
          localStorage.setItem('sangini-periods', JSON.stringify(data.periods));
        }
        
        if (data.symptoms && Array.isArray(data.symptoms)) {
          setSymptoms(data.symptoms);
          localStorage.setItem('sangini-symptoms', JSON.stringify(data.symptoms));
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setPeriods([]);
      setSymptoms([]);
      localStorage.removeItem('sangini-periods');
      localStorage.removeItem('sangini-symptoms');
      alert('All data cleared successfully.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <span>Data Management</span>
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={exportData}
          className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export Data</span>
        </button>

        <label className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors cursor-pointer">
          <Upload className="h-5 w-5" />
          <span>Import Data</span>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>

        <button
          onClick={clearAllData}
          className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <Database className="h-5 w-5" />
          <span>Clear All Data</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Data Summary:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Periods Tracked:</span> {periods.length}
          </div>
          <div>
            <span className="font-medium">Symptoms Logged:</span> {symptoms.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackup;