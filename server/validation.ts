import { HouseholdProfileType, ActivityType, TimeOfDay } from '../src/types/user';

export const VALID_PROFILES: readonly HouseholdProfileType[] = [
  'General Adult',
  'Child',
  'Elderly Person',
  'Sensitive Individual',
  'Outdoor Worker',
] as const;

export const VALID_ACTIVITIES: readonly ActivityType[] = [
  'Morning Walk / Jog',
  'Cycling',
  'Outdoor Work / Labor',
  'Office Commute',
  'School / Playground',
  'Indoor Fitness',
  'General Errand',
] as const;

export const VALID_TIME_SLOTS: readonly TimeOfDay[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
] as const;

export interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data?: T;
}

export function sanitizeString(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim()
    .slice(0, maxLength);
}

export interface ValidatedRecommendationsParams {
  aqi: number;
  pm2_5: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  activity: ActivityType;
  householdProfile: HouseholdProfileType;
  timeOfDay: TimeOfDay;
  cityName: string;
}

export function validateRecommendationsInput(body: unknown): ValidationResult<ValidatedRecommendationsParams> {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  const aqi = Number(b.aqi);
  if (isNaN(aqi) || aqi < 0 || aqi > 1000) {
    return { isValid: false, error: 'Invalid AQI: must be a number between 0 and 1000' };
  }

  const pm2_5 = Number(b.pm2_5);
  if (isNaN(pm2_5) || pm2_5 < 0 || pm2_5 > 2000) {
    return { isValid: false, error: 'Invalid PM2.5: must be a valid atmospheric reading' };
  }

  const pm10 = Number(b.pm10);
  if (isNaN(pm10) || pm10 < 0 || pm10 > 2500) {
    return { isValid: false, error: 'Invalid PM10: must be a valid atmospheric reading' };
  }

  const temperature = Number(b.temperature);
  if (isNaN(temperature) || temperature < -50 || temperature > 65) {
    return { isValid: false, error: 'Invalid temperature: must be between -50°C and 65°C' };
  }

  const humidity = Number(b.humidity);
  if (isNaN(humidity) || humidity < 0 || humidity > 100) {
    return { isValid: false, error: 'Invalid humidity: must be between 0% and 100%' };
  }

  const windSpeed = Number(b.windSpeed);
  if (isNaN(windSpeed) || windSpeed < 0 || windSpeed > 250) {
    return { isValid: false, error: 'Invalid wind speed: must be a non-negative number' };
  }

  const cityName = sanitizeString(b.cityName, 100);
  if (!cityName) {
    return { isValid: false, error: 'City name is required' };
  }

  const householdProfile = b.householdProfile as HouseholdProfileType;
  if (!VALID_PROFILES.includes(householdProfile)) {
    return { isValid: false, error: `Invalid household profile. Must be one of: ${VALID_PROFILES.join(', ')}` };
  }

  const activity = b.activity as ActivityType;
  if (!VALID_ACTIVITIES.includes(activity)) {
    return { isValid: false, error: `Invalid activity type. Must be one of: ${VALID_ACTIVITIES.join(', ')}` };
  }

  const timeOfDay = b.timeOfDay as TimeOfDay;
  if (!VALID_TIME_SLOTS.includes(timeOfDay)) {
    return { isValid: false, error: `Invalid time of day. Must be one of: ${VALID_TIME_SLOTS.join(', ')}` };
  }

  return {
    isValid: true,
    data: {
      aqi,
      pm2_5,
      pm10,
      temperature,
      humidity,
      windSpeed,
      activity,
      householdProfile,
      timeOfDay,
      cityName,
    },
  };
}

export interface ValidatedRoutineParams {
  city: string;
  activity: ActivityType;
  preferredOutdoorTime: TimeOfDay;
  householdProfile: HouseholdProfileType;
  currentAqi: number;
}

export function validateRoutineInput(body: unknown): ValidationResult<ValidatedRoutineParams> {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  const city = sanitizeString(b.city, 100);
  if (!city) {
    return { isValid: false, error: 'City is required' };
  }

  const currentAqi = Number(b.currentAqi);
  if (isNaN(currentAqi) || currentAqi < 0 || currentAqi > 1000) {
    return { isValid: false, error: 'Invalid AQI: must be between 0 and 1000' };
  }

  const householdProfile = b.householdProfile as HouseholdProfileType;
  if (!VALID_PROFILES.includes(householdProfile)) {
    return { isValid: false, error: `Invalid household profile. Must be one of: ${VALID_PROFILES.join(', ')}` };
  }

  const activity = b.activity as ActivityType;
  if (!VALID_ACTIVITIES.includes(activity)) {
    return { isValid: false, error: `Invalid activity. Must be one of: ${VALID_ACTIVITIES.join(', ')}` };
  }

  const preferredOutdoorTime = b.preferredOutdoorTime as TimeOfDay;
  if (!VALID_TIME_SLOTS.includes(preferredOutdoorTime)) {
    return { isValid: false, error: `Invalid time slot. Must be one of: ${VALID_TIME_SLOTS.join(', ')}` };
  }

  return {
    isValid: true,
    data: {
      city,
      activity,
      preferredOutdoorTime,
      householdProfile,
      currentAqi,
    },
  };
}

export interface ValidatedChatParams {
  message: string;
  cityContext?: {
    cityName: string;
    aqi: number;
  };
}

export function validateChatInput(body: unknown): ValidationResult<ValidatedChatParams> {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  const message = sanitizeString(b.message, 1000);
  if (!message || message.length < 1) {
    return { isValid: false, error: 'Message must not be empty (max 1000 characters)' };
  }

  let cityContext: { cityName: string; aqi: number } | undefined;
  if (b.cityContext && typeof b.cityContext === 'object') {
    const ctx = b.cityContext as Record<string, unknown>;
    const cityName = sanitizeString(ctx.cityName, 100) || 'Active City';
    const aqi = Number(ctx.aqi);
    cityContext = {
      cityName,
      aqi: isNaN(aqi) ? 150 : Math.min(1000, Math.max(0, aqi)),
    };
  }

  return {
    isValid: true,
    data: {
      message,
      cityContext,
    },
  };
}

