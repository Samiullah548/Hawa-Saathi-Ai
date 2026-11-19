import { GoogleGenAI } from '@google/genai';
import { AISafetyRecommendation, AIRoutinePlan } from '../src/types/ai';
import { HouseholdProfileType, ActivityType, TimeOfDay } from '../src/types/user';
import {
  generateDeterministicRecommendations,
  generateDeterministicRoutine,
  generateDeterministicChatResponse,
} from './fallbackEngine';

function getGeminiClient(customKey?: string): GoogleGenAI | null {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function getAISafetyRecommendations(
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
  const ai = getGeminiClient(customKey);

  // If no Gemini API key is configured, use the deterministic rule engine immediately
  if (!ai) {
    console.info('Using rule-based expert safety engine (no Gemini API key configured).');
    return generateDeterministicRecommendations(params);
  }

  const prompt = `
You are HawaSaathi AI, an expert environmental and occupational health scientist specialized in urban air quality and winter smog protection in Indian cities.
Analyze the following live conditions and generate a highly rigorous, personalized safety assessment:

City: ${params.cityName}
Current US AQI: ${params.aqi}
PM2.5: ${params.pm2_5} µg/m³
PM10: ${params.pm10} µg/m³
Temperature: ${params.temperature}°C
Humidity: ${params.humidity}%
Wind Speed: ${params.windSpeed} km/h
Time of Day: ${params.timeOfDay}
User Activity: ${params.activity}
Household Profile: ${params.householdProfile}

Return ONLY a valid JSON object matching this schema:
{
  "safetyVerdict": "Safe" | "Caution Required" | "Unsafe" | "Dangerous",
  "suitabilityScore": number from 1 to 10,
  "headline": "concise 1-sentence assessment",
  "outdoorGuidance": "clear guidance on outdoor activity",
  "outdoorExplanation": "short explanation of WHY this is advised",
  "exerciseGuidance": "specific advice on workouts/sports",
  "maskRecommendation": {
    "recommended": boolean,
    "maskType": "None needed" | "Surgical / Cloth (Minimal)" | "N95 / FFP2 / KN95" | "N99 / N100",
    "details": "scientific reason and fit guidance"
  },
  "indoorCareTips": ["tip 1", "tip 2", "tip 3"],
  "ventilationAdvice": {
    "shouldVentilate": boolean,
    "recommendedWindow": "e.g. 1:00 PM - 3:30 PM",
    "details": "explanation of outdoor vs indoor air exchange"
  },
  "vulnerableGroupAlert": "dedicated note for ${params.householdProfile}",
  "scientificExplanation": "biological explanation of atmospheric dynamics and PM2.5 alveolar penetration",
  "disclaimer": "This is an AI environmental assessment based on CPCB and WHO guidelines, not a medical diagnosis."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text) as AISafetyRecommendation;
    // Validate essential fields
    if (!parsed.safetyVerdict || !parsed.suitabilityScore) {
      throw new Error('Incomplete JSON schema returned by Gemini');
    }

    return parsed;
  } catch (error) {
    console.warn('Gemini API call failed or rate-limited; falling back to expert rule engine:', error);
    return generateDeterministicRecommendations(params);
  }
}

export async function getAIRoutinePlan(
  params: {
    city: string;
    activity: ActivityType;
    preferredOutdoorTime: TimeOfDay;
    householdProfile: HouseholdProfileType;
    currentAqi: number;
  },
  customKey?: string
): Promise<AIRoutinePlan> {
  const ai = getGeminiClient(customKey);

  if (!ai) {
    return generateDeterministicRoutine(params);
  }

  const prompt = `
You are HawaSaathi AI. Generate an optimized daily protection routine for:
City: ${params.city}
Current AQI: ${params.currentAqi}
Planned Activity: ${params.activity}
Preferred Outdoor Time: ${params.preferredOutdoorTime}
Household Profile: ${params.householdProfile}

Return ONLY a valid JSON object matching this schema:
{
  "city": "${params.city}",
  "date": "formatted date",
  "householdProfile": "${params.householdProfile}",
  "plannedActivity": "${params.activity}",
  "overallAdvisory": "summary sentence",
  "routine": [
    {
      "timeBlock": "Morning" | "Afternoon" | "Evening" | "Night",
      "timeRange": "e.g. 06:00 AM - 10:00 AM",
      "recommendedActivity": "what to do",
      "pollutionRisk": "Low" | "Moderate" | "High" | "Severe",
      "safetyInstructions": "precautions",
      "scientificReason": "why at this time",
      "alternativeIndoorOption": "backup indoor activity"
    }
  ],
  "keySafetyTakeaway": "one key rule",
  "disclaimer": "Medical disclaimer notice"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    const parsed = JSON.parse(text) as AIRoutinePlan;
    if (!parsed.routine || !Array.isArray(parsed.routine)) {
      throw new Error('Invalid routine array');
    }
    return parsed;
  } catch (err) {
    console.warn('Gemini routine failed, falling back to expert routine:', err);
    return generateDeterministicRoutine(params);
  }
}

export async function getAIChatResponse(
  message: string,
  cityContext?: { cityName: string; aqi: number },
  customKey?: string
): Promise<string> {
  const ai = getGeminiClient(customKey);

  if (!ai) {
    return generateDeterministicChatResponse(message, cityContext);
  }

  const systemContext = `
You are HawaSaathi AI, a friendly, authoritative, and scientifically accurate urban air quality and health assistant.
The user is currently viewing ${cityContext?.cityName || 'an Indian city'} with live US AQI: ${cityContext?.aqi || 'Unavailable'}.
Answer user questions regarding air pollution, winter smog, PM2.5, respiratory health precautions, air purifiers, masks, and low-emission commuting.
Format your responses beautifully in GitHub Flavored Markdown with bullet points, bold highlights, and clear actionable steps.
Never invent fake live readings. If live data is unavailable, state so honestly. Always include a brief medical disclaimer when discussing health symptoms.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemContext}\n\nUser Question: ${message}` }] },
      ],
    });

    return response.text || generateDeterministicChatResponse(message, cityContext);
  } catch (err) {
    console.warn('Gemini chat failed, falling back to rule engine:', err);
    return generateDeterministicChatResponse(message, cityContext);
  }
}
