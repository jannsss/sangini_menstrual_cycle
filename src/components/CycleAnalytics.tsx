import React from 'react';
import { PeriodEntry, PCOSRiskFactors } from '../types';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, AlertTriangle, Heart, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CycleAnalyticsProps {
  periods: PeriodEntry[];
}

const CycleAnalytics: React.FC<CycleAnalyticsProps> = ({ periods }) => {
  const calculateCycleLengths = () => {
    if (periods.length < 2) return [];
    
    const sortedPeriods = periods.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const cycleLengths = [];
    
    for (let i = 1; i < sortedPeriods.length; i++) {
      const prevStart = new Date(sortedPeriods[i - 1].startDate);
      const currentStart = new Date(sortedPeriods[i].startDate);
      const cycleLength = Math.round((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
      cycleLengths.push(cycleLength);
    }
    
    return cycleLengths;
  };

  const calculatePCOSRisk = (): PCOSRiskFactors => {
    const cycleLengths = calculateCycleLengths();
    const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 28;
    
    const irregularCycles = cycleLengths.some(length => Math.abs(length - avgCycleLength) > 7);
    const longCycles = avgCycleLength > 35;
    const heavyBleeding = periods.filter(p => p.flow === 'heavy').length > periods.length * 0.5;
    const frequentSymptoms = periods.some(p => p.symptoms.length > 5);
    
    let riskScore = 0;
    if (irregularCycles) riskScore += 25;
    if (longCycles) riskScore += 30;
    if (heavyBleeding) riskScore += 20;
    if (frequentSymptoms) riskScore += 25;
    
    const recommendations = [];
    if (riskScore > 50) {
      recommendations.push('Consider consulting a gynecologist for PCOS screening');
      recommendations.push('Maintain a healthy diet with low glycemic index foods');
      recommendations.push('Regular exercise can help regulate hormones');
    } else if (riskScore > 25) {
      recommendations.push('Monitor your cycles closely');
      recommendations.push('Maintain a balanced diet and regular exercise');
    } else {
      recommendations.push('Your cycles appear regular - keep tracking!');
    }
    
    return {
      irregularCycles,
      longCycles,
      heavyBleeding,
      frequentSymptoms,
      riskScore,
      recommendations
    };
  };

  const cycleLengths = calculateCycleLengths();
  const pcosRisk = calculatePCOSRisk();

  const cycleChartData = {
    labels: cycleLengths.map((_, index) => `Cycle ${index + 1}`),
    datasets: [
      {
        label: 'Cycle Length (days)',
        data: cycleLengths,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const flowChartData = {
    labels: ['Light', 'Medium', 'Heavy'],
    datasets: [
      {
        label: 'Flow Distribution',
        data: [
          periods.filter(p => p.flow === 'light').length,
          periods.filter(p => p.flow === 'medium').length,
          periods.filter(p => p.flow === 'heavy').length,
        ],
        backgroundColor: [
          'rgba(251, 207, 232, 0.8)',
          'rgba(244, 63, 94, 0.6)',
          'rgba(190, 18, 60, 0.8)',
        ],
        borderColor: [
          'rgb(251, 207, 232)',
          'rgb(244, 63, 94)',
          'rgb(190, 18, 60)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span>Cycle Length Trends</span>
        </h3>
        {cycleLengths.length > 0 ? (
          <div className="h-64">
            <Line data={cycleChartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Track at least 2 cycles to see trends</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span>Flow Pattern Analysis</span>
        </h3>
        {periods.length > 0 ? (
          <div className="h-64">
            <Bar data={flowChartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No period data to analyze</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Heart className="h-6 w-6" />
          <span>PCOS/PCOD Risk Assessment</span>
        </h3>
        
        <div className={`p-4 rounded-lg mb-4 ${
          pcosRisk.riskScore > 50 ? 'bg-red-50 border border-red-200' :
          pcosRisk.riskScore > 25 ? 'bg-yellow-50 border border-yellow-200' :
          'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className={`h-5 w-5 ${
              pcosRisk.riskScore > 50 ? 'text-red-500' :
              pcosRisk.riskScore > 25 ? 'text-yellow-500' :
              'text-green-500'
            }`} />
            <span className="font-semibold">
              Risk Score: {pcosRisk.riskScore}/100
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {pcosRisk.riskScore > 50 ? 'Higher risk - Consider medical consultation' :
             pcosRisk.riskScore > 25 ? 'Moderate risk - Monitor closely' :
             'Low risk - Cycles appear normal'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Risk Factors:</h4>
            <div className="space-y-1 text-sm">
              <div className={`flex items-center space-x-2 ${pcosRisk.irregularCycles ? 'text-red-600' : 'text-green-600'}`}>
                <span>{pcosRisk.irregularCycles ? '⚠️' : '✅'}</span>
                <span>Irregular cycles</span>
              </div>
              <div className={`flex items-center space-x-2 ${pcosRisk.longCycles ? 'text-red-600' : 'text-green-600'}`}>
                <span>{pcosRisk.longCycles ? '⚠️' : '✅'}</span>
                <span>Long cycles (&gt;35 days)</span>
              </div>
              <div className={`flex items-center space-x-2 ${pcosRisk.heavyBleeding ? 'text-red-600' : 'text-green-600'}`}>
                <span>{pcosRisk.heavyBleeding ? '⚠️' : '✅'}</span>
                <span>Frequent heavy bleeding</span>
              </div>
              <div className={`flex items-center space-x-2 ${pcosRisk.frequentSymptoms ? 'text-red-600' : 'text-green-600'}`}>
                <span>{pcosRisk.frequentSymptoms ? '⚠️' : '✅'}</span>
                <span>Multiple symptoms</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Recommendations:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {pcosRisk.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Disclaimer:</strong> This assessment is for informational purposes only and should not replace professional medical advice. 
            Consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CycleAnalytics;