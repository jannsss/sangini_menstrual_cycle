import React from 'react';
import { PeriodEntry, CyclePrediction } from '../types';
import { calculateCyclePrediction, getCyclePhase } from '../utils/cycleCalculations';
import { Calendar, TrendingUp, Heart, Clock, Shield, BarChart3, Target } from 'lucide-react';

interface DashboardProps {
  periods: PeriodEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ periods }) => {
  const prediction = calculateCyclePrediction(periods);
  const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
  
  const currentPhase = lastPeriod 
    ? getCyclePhase(new Date(), new Date(lastPeriod.startDate), prediction?.cycleLength || 28)
    : 'unknown';

  const phaseColors = {
    menstrual: 'bg-red-100 text-red-800',
    follicular: 'bg-green-100 text-green-800',
    ovulation: 'bg-yellow-100 text-yellow-800',
    luteal: 'bg-purple-100 text-purple-800',
    unknown: 'bg-gray-100 text-gray-800'
  };

  const phaseNames = {
    menstrual: 'Menstrual Phase',
    follicular: 'Follicular Phase',
    ovulation: 'Ovulation Phase',
    luteal: 'Luteal Phase',
    unknown: 'Track your period to see phase'
  };

  return (
    <div className="space-y-6">
      {/* Privacy and Features Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Why Choose Sangini?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">100% Private</h3>
              <p className="text-sm text-gray-600">All data stored securely with full privacy—no tracking, no sharing</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="h-6 w-6 text-rose-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Smart Analytics</h3>
              <p className="text-sm text-gray-600">Charts, calendar views, and cycle summaries for easy understanding</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Accurate Predictions</h3>
              <p className="text-sm text-gray-600">Precisely predicts next period and ovulation using advanced analysis</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800">Always Available</h3>
              <p className="text-sm text-gray-600">Access basic features even in low connectivity or rural areas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-rose-400">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-sm text-gray-600">Current Phase</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${phaseColors[currentPhase as keyof typeof phaseColors]}`}>
                {phaseNames[currentPhase as keyof typeof phaseNames]}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-400">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Next Period</p>
              <p className="text-lg font-bold text-gray-800">
                {prediction ? new Date(prediction.nextPeriodStart).toLocaleDateString() : 'Track cycles'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Avg Cycle Length</p>
              <p className="text-lg font-bold text-gray-800">
                {prediction ? `${prediction.cycleLength} days` : '-- days'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Prediction Confidence</p>
              <p className="text-lg font-bold text-gray-800">
                {prediction ? `${prediction.confidence}%` : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {prediction && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cycle Insights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Next Period Prediction</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(prediction.nextPeriodStart).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{new Date(prediction.nextPeriodEnd).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{prediction.periodLength} days</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Cycle Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracked Cycles:</span>
                  <span className="font-medium">{periods.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Cycle:</span>
                  <span className="font-medium">{prediction.cycleLength} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Period:</span>
                  <span className="font-medium">{prediction.periodLength} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Analytics Chart */}
      {periods.length > 1 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Cycle Analytics</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500 mb-2">
                {periods.length}
              </div>
              <p className="text-gray-600">Cycles Tracked</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {prediction ? `${prediction.confidence}%` : '--'}
              </div>
              <p className="text-gray-600">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {prediction ? Math.round((prediction.cycleLength + prediction.periodLength) / 2) : '--'}
              </div>
              <p className="text-gray-600">Health Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;