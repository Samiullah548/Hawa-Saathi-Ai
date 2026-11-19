import { describe, it, expect } from 'vitest';
import { getAQICategory, getAQIColor, getAQIExplanation } from '../utils/aqiUtils';

describe('AQI Utilities', () => {
  it('correctly maps AQI values to US EPA categories', () => {
    expect(getAQICategory(30)).toBe('Good');
    expect(getAQICategory(50)).toBe('Good');
    expect(getAQICategory(75)).toBe('Moderate');
    expect(getAQICategory(100)).toBe('Moderate');
    expect(getAQICategory(125)).toBe('Unhealthy for Sensitive Groups');
    expect(getAQICategory(150)).toBe('Unhealthy for Sensitive Groups');
    expect(getAQICategory(180)).toBe('Unhealthy');
    expect(getAQICategory(200)).toBe('Unhealthy');
    expect(getAQICategory(250)).toBe('Very Unhealthy');
    expect(getAQICategory(300)).toBe('Very Unhealthy');
    expect(getAQICategory(350)).toBe('Hazardous');
    expect(getAQICategory(450)).toBe('Hazardous');
  });

  it('returns valid color hex codes and badge classes for categories', () => {
    const goodColor = getAQIColor('Good');
    expect(goodColor.hex).toBe('#10b981');
    expect(goodColor.badge).toContain('bg-emerald');

    const hazardousColor = getAQIColor('Hazardous');
    expect(hazardousColor.hex).toBe('#881337');
    expect(hazardousColor.badge).toContain('bg-rose');
  });

  it('provides medical and outdoor safety explanations with mask necessity flag', () => {
    const goodExp = getAQIExplanation('Good');
    expect(goodExp.maskRequired).toBe(false);
    expect(goodExp.outdoorAdvice).toContain('Ideal for all outdoor activities');

    const hazardousExp = getAQIExplanation('Hazardous');
    expect(hazardousExp.maskRequired).toBe(true);
    expect(hazardousExp.healthRisk).toContain('Emergency conditions');
  });
});

