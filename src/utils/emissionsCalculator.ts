// Commute Emissions Calculator & Factors for Indian Urban Context

export interface TransportMode {
  id: string;
  name: string;
  category: 'private_car' | 'two_wheeler' | 'public_transit' | 'active';
  emissionFactorGPerKm: number; // grams CO2 per vehicle-km or passenger-km
  isPerVehicle: boolean;
  color: string;
  badge: string;
}

export const TRANSPORT_MODES: TransportMode[] = [
  {
    id: 'petrol_car',
    name: 'Petrol Car',
    category: 'private_car',
    emissionFactorGPerKm: 170,
    isPerVehicle: true,
    color: '#ef4444',
    badge: 'High Emissions',
  },
  {
    id: 'diesel_car',
    name: 'Diesel Car',
    category: 'private_car',
    emissionFactorGPerKm: 160,
    isPerVehicle: true,
    color: '#f97316',
    badge: 'High PM & NOx',
  },
  {
    id: 'cng_auto',
    name: 'Auto-rickshaw (CNG)',
    category: 'public_transit',
    emissionFactorGPerKm: 85,
    isPerVehicle: true,
    color: '#eab308',
    badge: 'Moderate',
  },
  {
    id: 'motorcycle',
    name: 'Petrol Two-Wheeler / Bike',
    category: 'two_wheeler',
    emissionFactorGPerKm: 45,
    isPerVehicle: true,
    color: '#f59e0b',
    badge: 'Moderate',
  },
  {
    id: 'electric_car',
    name: 'Electric Car (EV)',
    category: 'private_car',
    emissionFactorGPerKm: 55, // Considering ~0.72 kg CO2/kWh Indian grid factor
    isPerVehicle: true,
    color: '#10b981',
    badge: 'Low Tailpipe',
  },
  {
    id: 'electric_scooter',
    name: 'Electric Two-Wheeler (E-Scooter)',
    category: 'two_wheeler',
    emissionFactorGPerKm: 18,
    isPerVehicle: true,
    color: '#059669',
    badge: 'Very Low',
  },
  {
    id: 'city_bus',
    name: 'City Bus (Public Transit)',
    category: 'public_transit',
    emissionFactorGPerKm: 30, // Per passenger-km (average 35 passengers)
    isPerVehicle: false,
    color: '#0284c7',
    badge: 'Eco Efficient',
  },
  {
    id: 'metro_train',
    name: 'Metro / Suburban Train',
    category: 'public_transit',
    emissionFactorGPerKm: 18, // Per passenger-km
    isPerVehicle: false,
    color: '#0d9488',
    badge: 'Lowest Carbon Transit',
  },
  {
    id: 'bicycle_walk',
    name: 'Walking / Bicycle',
    category: 'active',
    emissionFactorGPerKm: 0,
    isPerVehicle: false,
    color: '#15803d',
    badge: 'Zero Emission',
  },
];

export interface CommuteCalculationResult {
  oneWayDistanceKm: number;
  tripsPerDay: number;
  daysPerWeek: number;
  passengers: number;
  currentMode: TransportMode;
  alternativeMode: TransportMode;
  
  // Current stats
  currentTripKgCO2: number;
  currentAnnualKgCO2: number;
  
  // Alternative stats
  alternativeTripKgCO2: number;
  alternativeAnnualKgCO2: number;
  
  // Savings
  annualSavingsKgCO2: number;
  percentageReduction: number;
  treesEquivalentPerYear: number;
  
  // Explanation
  explanation: string;
}

export function calculateCommuteEmissions(
  oneWayDistanceKm: number,
  tripsPerDay: number,
  daysPerWeek: number,
  passengers: number,
  currentModeId: string,
  alternativeModeId: string = 'metro_train'
): CommuteCalculationResult {
  const currentMode = TRANSPORT_MODES.find(m => m.id === currentModeId) || TRANSPORT_MODES[0];
  const altMode = TRANSPORT_MODES.find(m => m.id === alternativeModeId) || TRANSPORT_MODES[7]; // metro default
  
  const validPassengers = Math.max(1, passengers);
  const totalAnnualTrips = tripsPerDay * daysPerWeek * 50; // 50 weeks per year

  // Calculate grams per trip per passenger
  let currentGramsPerTrip: number;
  if (currentMode.isPerVehicle) {
    currentGramsPerTrip = (currentMode.emissionFactorGPerKm * oneWayDistanceKm) / validPassengers;
  } else {
    currentGramsPerTrip = currentMode.emissionFactorGPerKm * oneWayDistanceKm;
  }

  let altGramsPerTrip: number;
  if (altMode.isPerVehicle) {
    altGramsPerTrip = (altMode.emissionFactorGPerKm * oneWayDistanceKm) / validPassengers;
  } else {
    altGramsPerTrip = altMode.emissionFactorGPerKm * oneWayDistanceKm;
  }

  const currentTripKg = currentGramsPerTrip / 1000;
  const currentAnnualKg = (currentGramsPerTrip * totalAnnualTrips) / 1000;

  const altTripKg = altGramsPerTrip / 1000;
  const altAnnualKg = (altGramsPerTrip * totalAnnualTrips) / 1000;

  const annualSavingsKg = Math.max(0, currentAnnualKg - altAnnualKg);
  const percentageReduction = currentAnnualKg > 0 ? (annualSavingsKg / currentAnnualKg) * 100 : 0;
  
  // A mature urban tree absorbs approximately 21.77 kg CO2 annually
  const treesEquivalent = annualSavingsKg / 21.77;

  let explanation = '';
  if (currentMode.id === altMode.id) {
    explanation = 'Both selected modes are identical. Try comparing against Delhi Metro, City Bus, or Carpooling to see potential savings.';
  } else if (annualSavingsKg > 0) {
    explanation = `Switching from ${currentMode.name} to ${altMode.name} saves roughly ${annualSavingsKg.toFixed(1)} kg of CO₂ every year for your ${oneWayDistanceKm} km commute. This equals the annual carbon absorption of ${treesEquivalent.toFixed(1)} mature trees, while directly lowering tailpipe particulate smog in your city!`;
  } else {
    explanation = `${currentMode.name} is already a cleaner, lower-emission transport mode than ${altMode.name}.`;
  }

  return {
    oneWayDistanceKm,
    tripsPerDay,
    daysPerWeek,
    passengers: validPassengers,
    currentMode,
    alternativeMode: altMode,
    currentTripKgCO2: Number(currentTripKg.toFixed(2)),
    currentAnnualKgCO2: Number(currentAnnualKg.toFixed(1)),
    alternativeTripKgCO2: Number(altTripKg.toFixed(2)),
    alternativeAnnualKgCO2: Number(altAnnualKg.toFixed(1)),
    annualSavingsKgCO2: Number(annualSavingsKg.toFixed(1)),
    percentageReduction: Math.round(percentageReduction),
    treesEquivalentPerYear: Number(treesEquivalent.toFixed(1)),
    explanation,
  };
}
