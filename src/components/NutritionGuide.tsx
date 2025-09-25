import React, { useState } from 'react';
import { PeriodEntry } from '../types';
import { nutritionRecommendations } from '../data/nutritionData';
import { getCyclePhase } from '../utils/cycleCalculations';
import { Utensils, Info, CheckCircle, XCircle } from 'lucide-react';

interface NutritionGuideProps {
  periods: PeriodEntry[];
}

const NutritionGuide: React.FC<NutritionGuideProps> = ({ periods }) => {
  const [selectedPhase, setSelectedPhase] = useState('menstrual');
  
  const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
  const currentPhase = lastPeriod 
    ? getCyclePhase(new Date(), new Date(lastPeriod.startDate), 28)
    : 'menstrual';

  const currentRecommendation = nutritionRecommendations.find(r => r.phase === selectedPhase);

  const phaseInfo = {
    menstrual: {
      name: 'Menstrual Phase',
      description: 'Days 1-5 of your cycle when menstruation occurs',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    follicular: {
      name: 'Follicular Phase',
      description: 'Days 1-13, when your body prepares for ovulation',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    ovulation: {
      name: 'Ovulation Phase',
      description: 'Around day 14, when the egg is released',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    luteal: {
      name: 'Luteal Phase',
      description: 'Days 15-28, after ovulation until next period',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Utensils className="h-6 w-6" />
          <span>Indian Nutrition for Menstrual Wellness</span>
        </h3>
        
        {lastPeriod && (
          <div className={`p-4 rounded-lg border-2 mb-6 ${phaseInfo[currentPhase as keyof typeof phaseInfo]?.color}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-5 w-5" />
              <span className="font-medium">Current Phase</span>
            </div>
            <p className="text-sm">
              You're currently in the <strong>{phaseInfo[currentPhase as keyof typeof phaseInfo]?.name}</strong>.
              {phaseInfo[currentPhase as keyof typeof phaseInfo]?.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {Object.entries(phaseInfo).map(([phase, info]) => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedPhase === phase
                  ? info.color
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${currentPhase === phase ? 'ring-2 ring-offset-2 ring-rose-400' : ''}`}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>

      {currentRecommendation && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Recommended Foods</span>
            </h4>
            <div className="space-y-3">
              {currentRecommendation.foods.map((food, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700">{food}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span>Foods to Limit</span>
            </h4>
            <div className="space-y-3">
              {currentRecommendation.avoid.map((food, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span className="text-gray-700">{food}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentRecommendation && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Health Benefits</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {currentRecommendation.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-xl p-6 border border-rose-200">
        <h4 className="text-lg font-bold text-gray-800 mb-3">💡 Ayurvedic Wisdom</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Warm foods</strong> help balance Vata dosha during menstruation</p>
          <p><strong>Iron-rich foods</strong> like jaggery and sesame seeds replenish lost minerals</p>
          <p><strong>Anti-inflammatory spices</strong> like turmeric and ginger reduce period pain</p>
          <p><strong>Hydrating foods</strong> like coconut water help maintain fluid balance</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">🌿 How Nutrition Affects Your Cycle</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Foods That Help Regulate Flow:</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Iron-rich foods:</strong> Reduce heavy bleeding and prevent anemia</li>
              <li>• <strong>Omega-3 sources:</strong> Reduce inflammation and cramping</li>
              <li>• <strong>Magnesium foods:</strong> Help muscle relaxation and reduce pain</li>
              <li>• <strong>Fiber-rich foods:</strong> Help hormone balance and detoxification</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Foods That May Worsen Symptoms:</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>High sugar foods:</strong> Can increase inflammation and mood swings</li>
              <li>• <strong>Excess caffeine:</strong> May worsen anxiety and breast tenderness</li>
              <li>• <strong>Processed foods:</strong> Can disrupt hormone balance</li>
              <li>• <strong>High sodium:</strong> Increases bloating and water retention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionGuide;