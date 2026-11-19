import { HouseholdProfileType, ActivityType, TimeOfDay } from '../types/user';

export const ACTIVITIES: readonly ActivityType[] = [
  'Morning Walk / Jog',
  'Cycling',
  'Outdoor Work / Labor',
  'Office Commute',
  'School / Playground',
  'Indoor Fitness',
  'General Errand',
] as const;

export const PROFILES: readonly HouseholdProfileType[] = [
  'General Adult',
  'Child',
  'Elderly Person',
  'Sensitive Individual',
  'Outdoor Worker',
] as const;

export const TIME_SLOTS: readonly TimeOfDay[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
] as const;
