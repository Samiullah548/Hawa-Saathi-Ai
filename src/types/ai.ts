// AI Types & Structured Response Schemas
import { AQICategory } from './airQuality';
import { HouseholdProfileType, ActivityType, TimeOfDay } from './user';

export interface AISafetyRecommendation {
  safetyVerdict: 'Safe' | 'Caution Required' | 'Unsafe' | 'Dangerous';
  suitabilityScore: number; // 1 to 10
  headline: string;
  outdoorGuidance: string;
  outdoorExplanation: string;
  exerciseGuidance: string;
  maskRecommendation: {
    recommended: boolean;
    maskType: 'None needed' | 'Surgical / Cloth (Minimal)' | 'N95 / FFP2 / KN95' | 'N99 / N100';
    details: string;
  };
  indoorCareTips: string[];
  ventilationAdvice: {
    shouldVentilate: boolean;
    recommendedWindow: string;
    details: string;
  };
  vulnerableGroupAlert: string;
  scientificExplanation: string;
  disclaimer: string;
}

export interface RoutineItem {
  timeBlock: TimeOfDay;
  timeRange: string;
  recommendedActivity: string;
  pollutionRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  safetyInstructions: string;
  scientificReason: string;
  alternativeIndoorOption: string;
}

export interface AIRoutinePlan {
  city: string;
  date: string;
  householdProfile: HouseholdProfileType;
  plannedActivity: ActivityType;
  overallAdvisory: string;
  routine: RoutineItem[];
  keySafetyTakeaway: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cityContext?: {
    cityName: string;
    aqi: number;
    category: AQICategory;
  };
}
