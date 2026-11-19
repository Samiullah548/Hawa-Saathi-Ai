import { AISafetyRecommendation, AIRoutinePlan } from '../types/ai';
import { HouseholdProfileType, ActivityType, TimeOfDay } from '../types/user';
import {
  generateDeterministicRecommendations,
  generateDeterministicRoutine,
  generateDeterministicChatResponse,
} from '../../server/fallbackEngine';

export async function fetchAISafetyRecommendations(
  params: {
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
  },
  customKey?: string
): Promise<AISafetyRecommendation> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (customKey) {
      headers['x-gemini-key'] = customKey;
    }

    const res = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, customKey }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend /api/ai/recommendations unreachable, using local deterministic fallback:', err);
    return generateDeterministicRecommendations(params);
  }
}

export async function fetchAIRoutinePlan(
  params: {
    city: string;
    activity: ActivityType;
    preferredOutdoorTime: TimeOfDay;
    householdProfile: HouseholdProfileType;
    currentAqi: number;
  },
  customKey?: string
): Promise<AIRoutinePlan> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (customKey) {
      headers['x-gemini-key'] = customKey;
    }

    const res = await fetch('/api/ai/routine', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, customKey }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Backend /api/ai/routine unreachable, using local deterministic routine fallback:', err);
    return generateDeterministicRoutine(params);
  }
}

export async function sendAIChatMessage(
  message: string,
  cityContext?: { cityName: string; aqi: number },
  customKey?: string
): Promise<string> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (customKey) {
      headers['x-gemini-key'] = customKey;
    }

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, cityContext, customKey }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('Backend /api/ai/chat unreachable, using local deterministic chat response:', err);
    return generateDeterministicChatResponse(message, cityContext);
  }
}
