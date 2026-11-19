import { describe, it, expect } from 'vitest';
import {
  generateDeterministicRecommendations,
  generateDeterministicRoutine,
  generateDeterministicChatResponse,
} from '../../server/fallbackEngine';

describe('Deterministic Expert Fallback Engine', () => {
  it('generates structured safety recommendations for hazardous smog', () => {
    const rec = generateDeterministicRecommendations({
      aqi: 340,
      pm2_5: 220,
      pm10: 380,
      temperature: 14,
      humidity: 85,
      windSpeed: 4,
      activity: 'Morning Walk / Jog',
      householdProfile: 'Child',
      timeOfDay: 'Morning',
      cityName: 'Delhi (NCR)',
    });

    expect(rec.safetyVerdict).toBe('Dangerous');
    expect(rec.suitabilityScore).toBeLessThanOrEqual(2);
    expect(rec.maskRecommendation.recommended).toBe(true);
    expect(rec.maskRecommendation.maskType).toBe('N95 / FFP2 / KN95');
    expect(rec.disclaimer).toContain('not constitute a formal medical diagnosis');
    expect(rec.vulnerableGroupAlert).toContain('Children');
  });

  it('generates structured daily routine with 4 time blocks', () => {
    const routine = generateDeterministicRoutine({
      city: 'Meerut',
      activity: 'Morning Walk / Jog',
      preferredOutdoorTime: 'Morning',
      householdProfile: 'Elderly Person',
      currentAqi: 280,
    });

    expect(routine.routine).toHaveLength(4);
    expect(routine.routine.map((r) => r.timeBlock)).toEqual([
      'Morning',
      'Afternoon',
      'Evening',
      'Night',
    ]);
  });

  it('generates context-aware chatbot answers for exercise queries', () => {
    const response = generateDeterministicChatResponse('Can I go for a run in Delhi?', {
      cityName: 'Delhi',
      aqi: 260,
    });

    expect(response).toContain('Outdoor Exercise Advisory for Delhi');
    expect(response).toContain('Avoid Outdoor Exercise');
  });
});
