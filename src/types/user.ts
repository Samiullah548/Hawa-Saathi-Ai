// User Profile & Preferences Types
import { CityLocation } from './airQuality';

export type HouseholdProfileType = 
  | 'General Adult'
  | 'Child'
  | 'Elderly Person'
  | 'Sensitive Individual'
  | 'Outdoor Worker';

export type ActivityType = 
  | 'Morning Walk / Jog'
  | 'Cycling'
  | 'Outdoor Work / Labor'
  | 'Office Commute'
  | 'School / Playground'
  | 'Indoor Fitness'
  | 'General Errand';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface UserPreferences {
  defaultCity: CityLocation;
  favoriteCities: CityLocation[];
  householdProfile: HouseholdProfileType;
  primaryActivities: ActivityType[];
  units: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  alertThreshold: number; // e.g. 150 (Unhealthy)
  customGeminiApiKey?: string;
  hasCompletedOnboarding: boolean;
  smogActionsState: {
    hasAirPurifier: boolean;
    hasN95Masks: boolean;
    keepsWindowsClosedAtPeak: boolean;
    usesExhaustWhileCooking: boolean;
    staysHydrated: boolean;
    monitorsDailyAQI: boolean;
  };
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'indoor' | 'family' | 'travel';
  description: string;
  isCompleted: boolean;
  frequency: 'daily' | 'weekly' | 'seasonal';
}
