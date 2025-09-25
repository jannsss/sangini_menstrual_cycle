import { PeriodEntry, CyclePrediction } from '../types';

export const calculateCyclePrediction = (periods: PeriodEntry[]): CyclePrediction | null => {
  if (periods.length < 2) return null;

  const sortedPeriods = periods.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  // Calculate average cycle length
  let cycleLengths: number[] = [];
  for (let i = 1; i < sortedPeriods.length; i++) {
    const prevStart = new Date(sortedPeriods[i - 1].startDate);
    const currentStart = new Date(sortedPeriods[i].startDate);
    const cycleLength = Math.round((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
    cycleLengths.push(cycleLength);
  }

  const avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);

  // Calculate average period length
  const periodLengths = sortedPeriods.map(period => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  });

  const avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);

  // Predict next period
  const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
  const lastPeriodStart = new Date(lastPeriod.startDate);
  const nextPeriodStart = new Date(lastPeriodStart);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

  const nextPeriodEnd = new Date(nextPeriodStart);
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + avgPeriodLength - 1);

  // Calculate confidence based on cycle regularity
  const variance = cycleLengths.reduce((acc, length) => acc + Math.pow(length - avgCycleLength, 2), 0) / cycleLengths.length;
  const standardDeviation = Math.sqrt(variance);
  const confidence = Math.max(0, Math.min(100, 100 - (standardDeviation * 10)));

  return {
    nextPeriodStart: nextPeriodStart.toISOString().split('T')[0],
    nextPeriodEnd: nextPeriodEnd.toISOString().split('T')[0],
    cycleLength: avgCycleLength,
    periodLength: avgPeriodLength,
    confidence: Math.round(confidence)
  };
};

export const getCyclePhase = (currentDate: Date, lastPeriodStart: Date, cycleLength: number): string => {
  const daysSinceLastPeriod = Math.floor((currentDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastPeriod <= 5) return 'menstrual';
  if (daysSinceLastPeriod <= 12) return 'follicular';
  if (daysSinceLastPeriod <= 16) return 'ovulation';
  return 'luteal';
};