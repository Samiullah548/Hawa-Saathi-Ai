// Air Quality & Weather Types

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface PollutantInfo {
  name: string;
  chemicalFormula: string;
  value: number;
  unit: string;
  whoStandard: number;
  cpcbStandard: number; // Indian standard (CPCB NAAQS)
  status: AQICategory;
  description: string;
  healthEffects: string;
}

export interface CurrentAirQuality {
  aqi: number;
  aqiCategory: AQICategory;
  aqiColor: string;
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  dominantPollutant: string;
  timestamp: string;
  sourceAttribution: string;
}

export interface CurrentWeather {
  temperature: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  weatherCode: number;
  weatherCondition: string;
  apparentTemperature?: number;
}

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  aqi: number;
  pm2_5: number;
  pm10: number;
  temperature: number;
  humidity: number;
  category: AQICategory;
}

export interface DailyForecastPoint {
  date: string;
  dayName: string;
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  dominantPollutant: string;
  category: AQICategory;
}

export interface CityLocation {
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  isPopular?: boolean;
}

export interface AirQualityCombinedData {
  location: CityLocation;
  current: CurrentAirQuality;
  weather: CurrentWeather;
  hourly: HourlyForecastPoint[];
  daily: DailyForecastPoint[];
  lastUpdated: string;
  isLive: boolean;
}

