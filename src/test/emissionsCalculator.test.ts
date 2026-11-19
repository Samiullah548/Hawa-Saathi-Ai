import { describe, it, expect } from 'vitest';
import { calculateCommuteEmissions, TRANSPORT_MODES } from '../utils/emissionsCalculator';

describe('Commute Emissions Calculator', () => {
  it('correctly calculates petrol car emissions for a daily commute', () => {
    // 15 km one way, 2 trips per day, 5 days per week, 1 passenger
    const result = calculateCommuteEmissions(15, 2, 5, 1, 'petrol_car', 'metro_train');

    // Petrol car is 170g/km -> 15 * 170 = 2550g = 2.55 kg/trip
    expect(result.currentTripKgCO2).toBe(2.55);

    // Annual trips = 2 * 5 * 50 = 500 trips. 500 * 2.55 = 1275 kg/yr
    expect(result.currentAnnualKgCO2).toBe(1275);

    // Metro is 18g/km -> 15 * 18 = 270g = 0.27 kg/trip
    expect(result.alternativeTripKgCO2).toBe(0.27);
    expect(result.alternativeAnnualKgCO2).toBe(135);

    // Savings = 1275 - 135 = 1140 kg CO2
    expect(result.annualSavingsKgCO2).toBe(1140);
    expect(result.percentageReduction).toBeGreaterThanOrEqual(85);
    expect(result.treesEquivalentPerYear).toBeGreaterThan(40);
  });

  it('divides vehicle emissions equally when carpooling with multiple passengers', () => {
    const solo = calculateCommuteEmissions(20, 2, 5, 1, 'petrol_car', 'metro_train');
    const carpool = calculateCommuteEmissions(20, 2, 5, 2, 'petrol_car', 'metro_train');

    expect(carpool.currentTripKgCO2).toBeCloseTo(solo.currentTripKgCO2 / 2, 1);
  });
});

