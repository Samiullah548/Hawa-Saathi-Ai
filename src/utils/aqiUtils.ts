import { AQICategory, PollutantInfo } from '../types/airQuality';

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIColor(category: AQICategory): {
  bg: string;
  text: string;
  border: string;
  hex: string;
  badge: string;
  lightBg: string;
} {
  switch (category) {
    case 'Good':
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        hex: '#10b981',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        lightBg: 'bg-emerald-50',
      };
    case 'Moderate':
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        border: 'border-amber-200',
        hex: '#f59e0b',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        lightBg: 'bg-amber-50',
      };
    case 'Unhealthy for Sensitive Groups':
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        border: 'border-orange-200',
        hex: '#f97316',
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        lightBg: 'bg-orange-50',
      };
    case 'Unhealthy':
      return {
        bg: 'bg-rose-500',
        text: 'text-rose-700',
        border: 'border-rose-200',
        hex: '#ef4444',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        lightBg: 'bg-rose-50',
      };
    case 'Very Unhealthy':
      return {
        bg: 'bg-purple-600',
        text: 'text-purple-700',
        border: 'border-purple-200',
        hex: '#8b5cf6',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        lightBg: 'bg-purple-50',
      };
    case 'Hazardous':
    default:
      return {
        bg: 'bg-rose-950',
        text: 'text-rose-900',
        border: 'border-rose-300',
        hex: '#881337',
        badge: 'bg-rose-200 text-rose-950 border-rose-400 font-semibold',
        lightBg: 'bg-rose-100',
      };
  }
}

export function getAQIExplanation(category: AQICategory): {
  summary: string;
  healthRisk: string;
  outdoorAdvice: string;
  maskRequired: boolean;
} {
  switch (category) {
    case 'Good':
      return {
        summary: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
        healthRisk: 'Clean air. No significant health impacts for anyone in the community.',
        outdoorAdvice: 'Ideal for all outdoor activities, workouts, and natural ventilation.',
        maskRequired: false,
      };
    case 'Moderate':
      return {
        summary: 'Air quality is acceptable; however, some pollutants may cause moderate concern for a very small number of people.',
        healthRisk: 'Unusually sensitive individuals may experience slight respiratory irritation.',
        outdoorAdvice: 'Outdoor activities are generally safe. Sensitive individuals should observe how they feel.',
        maskRequired: false,
      };
    case 'Unhealthy for Sensitive Groups':
      return {
        summary: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
        healthRisk: 'Children, elderly, and people with respiratory or heart disease face elevated risk.',
        outdoorAdvice: 'Sensitive groups should reduce prolonged or heavy outdoor exertion. Shift workouts indoors.',
        maskRequired: false,
      };
    case 'Unhealthy':
      return {
        summary: 'Everyone may begin to experience adverse health effects; members of sensitive groups may experience more serious effects.',
        healthRisk: 'Significant airway inflammation, coughing, throat dryness, eye irritation, and reduced lung capacity.',
        outdoorAdvice: 'Avoid intense outdoor exercise. Keep windows closed and wear an N95 mask outside.',
        maskRequired: true,
      };
    case 'Very Unhealthy':
      return {
        summary: 'Health alert: The risk of health effects is increased for everyone. Winter smog inversion conditions.',
        healthRisk: 'Serious aggravation of heart and lung conditions. Healthy adults experience acute fatigue and breathing difficulty.',
        outdoorAdvice: 'Strictly avoid outdoor sports and walks. Run air purifiers indoors and seal window gaps.',
        maskRequired: true,
      };
    case 'Hazardous':
    default:
      return {
        summary: 'Emergency health warning: Everyone is more likely to be affected with severe respiratory symptoms.',
        healthRisk: 'Emergency conditions. Breathing raw outdoor air is equivalent to smoking multiple cigarettes per day.',
        outdoorAdvice: 'Remain indoors with HEPA air purification. Never exercise outdoors. N95/FFP2 mask mandatory for any necessary transit.',
        maskRequired: true,
      };
  }
}

export const POLLUTANT_DEFINITIONS: Record<string, {
  name: string;
  chemicalFormula: string;
  unit: string;
  whoStandard: number;
  cpcbStandard: number; // Indian standard (24-hour limit)
  description: string;
  healthEffects: string;
  sources: string;
}> = {
  pm2_5: {
    name: 'Fine Particulate Matter (PM2.5)',
    chemicalFormula: 'PM2.5',
    unit: 'µg/m³',
    whoStandard: 15,
    cpcbStandard: 60,
    description: 'Ultra-fine inhalable particles with diameters 2.5 micrometers or smaller (1/30th the width of a human hair).',
    healthEffects: 'Penetrates deep into the alveolar sacs of lungs and enters the bloodstream, causing vascular inflammation, cardiac strain, and reduced lung capacity.',
    sources: 'Vehicular exhaust, biomass burning, crop stubble burning, coal plants, and winter smog condensation.',
  },
  pm10: {
    name: 'Coarse Particulate Matter (PM10)',
    chemicalFormula: 'PM10',
    unit: 'µg/m³',
    whoStandard: 45,
    cpcbStandard: 100,
    description: 'Inhalable coarse particles between 2.5 and 10 micrometers.',
    healthEffects: 'Irritates the upper respiratory tract, eyes, nose, and throat. Triggers acute coughing, wheezing, and asthma attacks.',
    sources: 'Road dust, construction and demolition sites, windblown soil, and industrial emissions.',
  },
  nitrogen_dioxide: {
    name: 'Nitrogen Dioxide',
    chemicalFormula: 'NO₂',
    unit: 'µg/m³',
    whoStandard: 25,
    cpcbStandard: 80,
    description: 'A pungent, reddish-brown gas formed primarily during high-temperature fuel combustion.',
    healthEffects: 'Increases susceptibility to respiratory infections, inflames airways, and exacerbates childhood asthma.',
    sources: 'Motor vehicles (especially diesel engines), thermal power plants, and industrial boilers.',
  },
  sulphur_dioxide: {
    name: 'Sulphur Dioxide',
    chemicalFormula: 'SO₂',
    unit: 'µg/m³',
    whoStandard: 40,
    cpcbStandard: 80,
    description: 'A colorless gas with a choking odor formed by burning sulphur-containing fossil fuels.',
    healthEffects: 'Causes throat tightness, bronchoconstriction in asthmatics, and forms secondary particulate matter (sulphates).',
    sources: 'Coal-fired power generation, petroleum refineries, and heavy industrial furnaces.',
  },
  carbon_monoxide: {
    name: 'Carbon Monoxide',
    chemicalFormula: 'CO',
    unit: 'µg/m³',
    whoStandard: 4000,
    cpcbStandard: 2000,
    description: 'A colorless, odorless, and highly toxic gas produced by incomplete combustion of carbon-based fuels.',
    healthEffects: 'Binds with hemoglobin to form carboxyhemoglobin, reducing oxygen delivery to vital organs like the brain and heart.',
    sources: 'Vehicular idling, traffic jams, indoor solid-fuel cookstoves, and generators.',
  },
  ozone: {
    name: 'Ground-Level Ozone',
    chemicalFormula: 'O₃',
    unit: 'µg/m³',
    whoStandard: 100,
    cpcbStandard: 100,
    description: 'A secondary pollutant created by photochemical reactions between NOx and VOCs in the presence of sunlight.',
    healthEffects: 'Powerful oxidant that "sunburns" lung tissue, reduces lung function, and triggers severe chest tightness.',
    sources: 'Formed atmospherically on sunny afternoons from vehicular and industrial precursor emissions.',
  },
};

