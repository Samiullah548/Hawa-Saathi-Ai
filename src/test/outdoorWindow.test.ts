import { describe, it, expect } from 'vitest';
import { findBestOutdoorWindow } from '../utils/outdoorWindow';
import { HourlyForecastPoint } from '../types/airQuality';

describe('Smart Outdoor Window Algorithm', () => {
  const createMockHourlySeries = (hourlyAqis: number[]): HourlyForecastPoint[] => {
    return hourlyAqis.map((aqi, i) => {
      const hour = (6 + i) % 24; // starting 6 AM
      return {
        time: `${hour}:00`,
        hour,
        aqi,
        pm2_5: Math.round(aqi * 0.6),
        pm10: Math.round(aqi * 1.1),
        temperature: 22,
        humidity: 60,
        category: aqi > 200 ? 'Very Unhealthy' : aqi > 100 ? 'Moderate' : 'Good',
      };
    });
  };

  it('handles insufficient hourly data gracefully without throwing', () => {
    const result = findBestOutdoorWindow([], 150);
    expect(result.hasForecastData).toBe(false);
    expect(result.bestWindow).toBeNull();
    expect(result.worstWindow).toBeNull();
  });

  it('identifies the lowest pollution diurnal window accurately', () => {
    // 12 hours starting at 6 AM: 6am=300, 7am=290, 8am=260, 9am=220, 10am=180, 11am=130, 12pm=95, 1pm=90, 2pm=85, 3pm=95, 4pm=150, 5pm=240
    const aqis = [300, 290, 260, 220, 180, 130, 95, 90, 85, 95, 150, 240];
    const series = createMockHourlySeries(aqis);

    const result = findBestOutdoorWindow(series, 300);
    expect(result.hasForecastData).toBe(true);
    expect(result.bestWindow).not.toBeNull();
    expect(result.bestWindow?.avgAqi).toBeLessThanOrEqual(100);
    expect(result.worstWindow?.peakAqi).toBeGreaterThanOrEqual(250);
    expect(result.bestWindow?.qualityVsCurrent).toBe('Much Better');
  });

  it('marks qualityVsCurrent as Similar when variations are minor', () => {
    const uniformAqis = Array(15).fill(110);
    const series = createMockHourlySeries(uniformAqis);

    const result = findBestOutdoorWindow(series, 112);
    expect(result.hasForecastData).toBe(true);
    expect(result.bestWindow?.qualityVsCurrent).toBe('Similar');
  });
});
