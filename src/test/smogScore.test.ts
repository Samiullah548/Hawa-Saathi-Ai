import { describe, it, expect } from 'vitest';
import { calculateSmogSurvivalScore, SmogProtectionActions } from '../utils/smogScore';

describe('Smog Survival Score Algorithm', () => {
  const perfectActions: SmogProtectionActions = {
    hasAirPurifier: true,
    hasN95Masks: true,
    keepsWindowsClosedAtPeak: true,
    usesExhaustWhileCooking: true,
    staysHydrated: true,
    monitorsDailyAQI: true,
  };

  const noActions: SmogProtectionActions = {
    hasAirPurifier: false,
    hasN95Masks: false,
    keepsWindowsClosedAtPeak: false,
    usesExhaustWhileCooking: false,
    staysHydrated: false,
    monitorsDailyAQI: false,
  };

  it('rewards clean air with high base points and full protective habits', () => {
    const result = calculateSmogSurvivalScore(35, perfectActions);
    expect(result.environmentPoints).toBe(40);
    expect(result.actionPoints).toBe(60);
    expect(result.score).toBe(100);
    expect(result.tier).toBe('Fortified Shield');
  });

  it('reflects severe vulnerability when ambient air is hazardous with zero actions taken', () => {
    const result = calculateSmogSurvivalScore(380, noActions);
    expect(result.environmentPoints).toBe(2);
    expect(result.actionPoints).toBe(0);
    expect(result.score).toBe(2);
    expect(result.tier).toBe('High Vulnerability');
  });

  it('demonstrates that active mitigation substantially increases resilience even in smog', () => {
    const result = calculateSmogSurvivalScore(320, perfectActions);
    expect(result.environmentPoints).toBe(2);
    expect(result.actionPoints).toBe(60);
    expect(result.score).toBe(62);
    expect(result.tier).toBe('Moderate Protection');
  });
});
