import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateRecommendationsInput,
  validateRoutineInput,
  validateChatInput,
} from '../../server/validation';

describe('Server Validation and Sanitization Engine', () => {
  describe('sanitizeString', () => {
    it('removes ASCII control characters and strips dangerous leading/trailing spaces', () => {
      const malicious = '  \u0000Hello\u001F World!\u007F  ';
      const cleaned = sanitizeString(malicious, 50);
      expect(cleaned).toBe('Hello World!');
    });

    it('enforces maxLength truncation accurately', () => {
      const longInput = 'A'.repeat(500);
      const cleaned = sanitizeString(longInput, 100);
      expect(cleaned.length).toBe(100);
    });

    it('gracefully handles non-string and empty inputs', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(12345)).toBe('');
    });
  });

  describe('validateRecommendationsInput', () => {
    const validBody = {
      aqi: 220,
      pm2_5: 140,
      pm10: 210,
      temperature: 18,
      humidity: 65,
      windSpeed: 6,
      activity: 'Morning Walk / Jog',
      householdProfile: 'Child',
      timeOfDay: 'Morning',
      cityName: 'Delhi (NCR)',
    };

    it('accepts valid recommendation parameters', () => {
      const res = validateRecommendationsInput(validBody);
      expect(res.isValid).toBe(true);
      expect(res.data?.cityName).toBe('Delhi (NCR)');
      expect(res.data?.aqi).toBe(220);
    });

    it('rejects invalid AQI out of bounds (> 1000 or negative)', () => {
      const res = validateRecommendationsInput({ ...validBody, aqi: 1500 });
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Invalid AQI/);

      const negRes = validateRecommendationsInput({ ...validBody, aqi: -10 });
      expect(negRes.isValid).toBe(false);
    });

    it('rejects unapproved household profile or activity', () => {
      const res = validateRecommendationsInput({
        ...validBody,
        householdProfile: 'UnknownProfile',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Invalid household profile/);

      const resAct = validateRecommendationsInput({
        ...validBody,
        activity: 'Scuba Diving',
      });
      expect(resAct.isValid).toBe(false);
      expect(resAct.error).toMatch(/Invalid activity type/);
    });

    it('rejects non-object body or missing required cityName', () => {
      expect(validateRecommendationsInput(null).isValid).toBe(false);
      expect(validateRecommendationsInput('string').isValid).toBe(false);
      const noCity = validateRecommendationsInput({ ...validBody, cityName: '   ' });
      expect(noCity.isValid).toBe(false);
      expect(noCity.error).toMatch(/City name is required/);
    });
  });

  describe('validateRoutineInput', () => {
    const validRoutine = {
      city: 'Meerut',
      activity: 'Cycling',
      preferredOutdoorTime: 'Afternoon',
      householdProfile: 'Elderly Person',
      currentAqi: 185,
    };

    it('validates routine generator parameters correctly', () => {
      const res = validateRoutineInput(validRoutine);
      expect(res.isValid).toBe(true);
      expect(res.data?.city).toBe('Meerut');
      expect(res.data?.householdProfile).toBe('Elderly Person');
    });

    it('fails on missing city or invalid AQI', () => {
      expect(validateRoutineInput({ ...validRoutine, city: '' }).isValid).toBe(false);
      expect(validateRoutineInput({ ...validRoutine, currentAqi: 'abc' }).isValid).toBe(false);
    });
  });

  describe('validateChatInput', () => {
    it('validates proper chat input with optional city context', () => {
      const res = validateChatInput({
        message: 'What mask should my child wear in Ghaziabad?',
        cityContext: { cityName: 'Ghaziabad', aqi: 280 },
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.message).toContain('What mask');
      expect(res.data?.cityContext?.cityName).toBe('Ghaziabad');
      expect(res.data?.cityContext?.aqi).toBe(280);
    });

    it('rejects empty or whitespace-only chat messages', () => {
      const res = validateChatInput({ message: '   ' });
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/must not be empty/);
    });

    it('clamps excessive context AQI values gracefully', () => {
      const res = validateChatInput({
        message: 'Hello',
        cityContext: { cityName: 'Kanpur', aqi: 9999 },
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.cityContext?.aqi).toBe(1000);
    });
  });
});
