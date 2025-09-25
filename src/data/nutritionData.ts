import { NutritionRecommendation } from '../types';

export const nutritionRecommendations: NutritionRecommendation[] = [
  {
    phase: 'menstrual',
    foods: [
      'Iron-rich foods (spinach, methi, amaranth)',
      'Jaggery and dates for energy',
      'Turmeric milk with ginger',
      'Sesame seeds (til) and almonds',
      'Warm soups and dal',
      'Coconut water for hydration'
    ],
    benefits: [
      'Replenishes iron lost during menstruation',
      'Provides energy and reduces fatigue',
      'Anti-inflammatory properties reduce pain',
      'Maintains electrolyte balance'
    ],
    avoid: [
      'Cold foods and drinks',
      'Excessive caffeine',
      'High sodium foods',
      'Refined sugar'
    ]
  },
  {
    phase: 'follicular',
    foods: [
      'Fresh fruits (pomegranate, oranges, berries)',
      'Leafy greens (palak, methi, coriander)',
      'Whole grains (quinoa, brown rice, ragi)',
      'Lean proteins (dal, chickpeas)',
      'Pumpkin seeds and sunflower seeds',
      'Green tea with mint'
    ],
    benefits: [
      'Supports hormone production',
      'Provides sustained energy',
      'Rich in antioxidants',
      'Supports healthy ovulation'
    ],
    avoid: [
      'Heavy, oily foods',
      'Processed foods',
      'Excessive dairy'
    ]
  },
  {
    phase: 'ovulation',
    foods: [
      'Vitamin E rich foods (almonds, avocado)',
      'Zinc-rich foods (pumpkin seeds, cashews)',
      'Fresh herbs (basil, cilantro)',
      'Coconut and coconut oil',
      'Fish or plant-based omega-3 sources',
      'Fresh vegetable juices'
    ],
    benefits: [
      'Supports egg health',
      'Maintains hormonal balance',
      'Provides essential fatty acids',
      'Enhances fertility'
    ],
    avoid: [
      'High sugar foods',
      'Alcohol',
      'Trans fats'
    ]
  },
  {
    phase: 'luteal',
    foods: [
      'Magnesium-rich foods (dark chocolate, nuts)',
      'Complex carbs (sweet potato, oats)',
      'Calcium sources (sesame seeds, ragi)',
      'Herbal teas (chamomile, fennel)',
      'Banana and other potassium-rich foods',
      'Ghee in moderation'
    ],
    benefits: [
      'Reduces PMS symptoms',
      'Stabilizes mood',
      'Prevents bloating',
      'Supports sleep quality'
    ],
    avoid: [
      'Excess salt',
      'Caffeine (especially evening)',
      'Processed foods',
      'High sugar snacks'
    ]
  }
];