export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate: string;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
}

export interface SymptomEntry {
  id: string;
  date: string;
  symptoms: string[];
  severity: { [key: string]: number };
  notes?: string;
}

export interface CyclePrediction {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  cycleLength: number;
  periodLength: number;
  confidence: number;
}

export interface NutritionRecommendation {
  phase: string;
  foods: string[];
  benefits: string[];
  avoid: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  createdAt: string;
}

export interface PCOSRiskFactors {
  irregularCycles: boolean;
  longCycles: boolean;
  heavyBleeding: boolean;
  frequentSymptoms: boolean;
  riskScore: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: string;
  isFromMBBS: boolean;
  mbbs_student_id?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'period' | 'ovulation' | 'health' | 'reminder';
  date: string;
  read: boolean;
}