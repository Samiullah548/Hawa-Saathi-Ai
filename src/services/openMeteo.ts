import {
  AirQualityCombinedData,
  CityLocation,
  CurrentAirQuality,
  CurrentWeather,
  DailyForecastPoint,
  HourlyForecastPoint,
} from '../types/airQuality';
import { getAQICategory, getAQIColor } from '../utils/aqiUtils';

// Curated list of major Indian cities with precise coordinates
export const POPULAR_INDIAN_CITIES: CityLocation[] = [
  { name: 'Delhi (NCR)', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, isPopular: true },
  { name: 'Noida', state: 'Uttar Pradesh', country: 'India', latitude: 28.5355, longitude: 77.3910, isPopular: true },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538, isPopular: true },
  { name: 'Meerut', state: 'Uttar Pradesh', country: 'India', latitude: 28.9845, longitude: 77.7064, isPopular: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, isPopular: true },
  { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319, isPopular: true },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, isPopular: true },
  { name: 'Pune', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, isPopular: true },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, isPopular: true },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, isPopular: true },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, isPopular: true },
  { name: 'Gurugram', state: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, isPopular: true },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, isPopular: true },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, isPopular: true },
  { name: 'Patna', state: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, isPopular: true },
  { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, isPopular: true },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, isPopular: true },
];

export function getWeatherConditionName(code: number): string {
  switch (code) {
    case 0: return 'Clear Sky';
    case 1: return 'Mainly Clear';
    case 2: return 'Partly Cloudy';
    case 3: return 'Overcast';
    case 45: return 'Smoggy Fog';
    case 48: return 'Depositing Rime Fog';
    case 51:
    case 53:
    case 55: return 'Drizzle';
    case 61:
    case 63:
    case 65: return 'Rain';
    case 71:
    case 73:
    case 75: return 'Light Snow';
    case 80:
    case 81:
    case 82: return 'Rain Showers';
    case 95: return 'Thunderstorm';
    default: return 'Hazy Smog';
  }
}

// In-memory cache to avoid refetching data within 3 minutes
const cache = new Map<string, { data: AirQualityCombinedData; timestamp: number }>();
const CACHE_TTL_MS = 3 * 60 * 1000;

export async function fetchAirQualityAndWeather(location: CityLocation): Promise<AirQualityCombinedData> {
  const cacheKey = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const { latitude, longitude } = location;

  try {
    const [aqResponse, weatherResponse] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto&forecast_days=7`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&hourly=temperature_2m,relative_humidity_2m&timezone=auto&forecast_days=7`
      ),
    ]);

    if (!aqResponse.ok || !weatherResponse.ok) {
      throw new Error(`Open-Meteo API returned status ${aqResponse.status} / ${weatherResponse.status}`);
    }

    const aqData = await aqResponse.json();
    const weatherData = await weatherResponse.json();

    // Parse current AQI
    const currentAqi = Math.round(aqData.current?.us_aqi ?? 120);
    const pm2_5 = Math.round(aqData.current?.pm2_5 ?? 45);
    const pm10 = Math.round(aqData.current?.pm10 ?? 85);
    const carbon_monoxide = Math.round(aqData.current?.carbon_monoxide ?? 450);
    const nitrogen_dioxide = Math.round(aqData.current?.nitrogen_dioxide ?? 35);
    const sulphur_dioxide = Math.round(aqData.current?.sulphur_dioxide ?? 15);
    const ozone = Math.round(aqData.current?.ozone ?? 40);

    const aqiCategory = getAQICategory(currentAqi);
    const aqiColor = getAQIColor(aqiCategory).hex;

    // Dominant pollutant determination
    let dominantPollutant = 'PM2.5';
    if (pm2_5 > 60) dominantPollutant = 'PM2.5 (Fine Particles)';
    else if (pm10 > 100) dominantPollutant = 'PM10 (Coarse Dust)';
    else if (nitrogen_dioxide > 80) dominantPollutant = 'NO₂ (Nitrogen Dioxide)';
    else if (ozone > 100) dominantPollutant = 'O₃ (Ground Ozone)';

    const currentAQ: CurrentAirQuality = {
      aqi: currentAqi,
      aqiCategory,
      aqiColor,
      pm2_5,
      pm10,
      carbon_monoxide,
      nitrogen_dioxide,
      sulphur_dioxide,
      ozone,
      dominantPollutant,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceAttribution: 'Open-Meteo European / CAMS & Copernicus Atmospheric Model',
    };

    // Weather parsing
    const currentW: CurrentWeather = {
      temperature: Math.round(weatherData.current?.temperature_2m ?? 24),
      humidity: Math.round(weatherData.current?.relative_humidity_2m ?? 55),
      windSpeed: Math.round(weatherData.current?.wind_speed_10m ?? 8),
      weatherCode: weatherData.current?.weather_code ?? 0,
      weatherCondition: getWeatherConditionName(weatherData.current?.weather_code ?? 0),
      apparentTemperature: Math.round(weatherData.current?.apparent_temperature ?? 24),
    };

    // Hourly Forecast (Next 24 to 48 hours)
    const hourlyTimes: string[] = aqData.hourly?.time || [];
    const hourlyAqi: number[] = aqData.hourly?.us_aqi || [];
    const hourlyPm25: number[] = aqData.hourly?.pm2_5 || [];
    const hourlyPm10: number[] = aqData.hourly?.pm10 || [];
    const weatherHourlyTimes: string[] = weatherData.hourly?.time || [];
    const weatherHourlyTemp: number[] = weatherData.hourly?.temperature_2m || [];
    const weatherHourlyHum: number[] = weatherData.hourly?.relative_humidity_2m || [];

    // Find current hour index
    const currentIsoHour = new Date().toISOString().slice(0, 13);
    let startIdx = hourlyTimes.findIndex(t => t.startsWith(currentIsoHour));
    if (startIdx === -1) startIdx = 0;

    const hourly: HourlyForecastPoint[] = [];
    for (let i = startIdx; i < Math.min(startIdx + 24, hourlyTimes.length); i++) {
      const rawTime = hourlyTimes[i];
      const hourDate = new Date(rawTime);
      const aqiVal = Math.round(hourlyAqi[i] ?? currentAqi);
      
      hourly.push({
        time: hourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        hour: hourDate.getHours(),
        aqi: aqiVal,
        pm2_5: Math.round(hourlyPm25[i] ?? pm2_5),
        pm10: Math.round(hourlyPm10[i] ?? pm10),
        temperature: Math.round(weatherHourlyTemp[i] ?? currentW.temperature),
        humidity: Math.round(weatherHourlyHum[i] ?? currentW.humidity),
        category: getAQICategory(aqiVal),
      });
    }

    // Daily Forecast (Next 7 days aggregated)
    const daily: DailyForecastPoint[] = [];
    const daysMap = new Map<string, number[]>();

    for (let i = 0; i < hourlyTimes.length; i++) {
      const dayKey = hourlyTimes[i].slice(0, 10);
      const aqiVal = hourlyAqi[i];
      if (aqiVal !== undefined && aqiVal !== null) {
        if (!daysMap.has(dayKey)) daysMap.set(dayKey, []);
        daysMap.get(dayKey)!.push(aqiVal);
      }
    }

    const daysEntries = Array.from(daysMap.entries()).slice(0, 7);
    for (const [dayStr, aqiList] of daysEntries) {
      const d = new Date(dayStr);
      const dayName = d.toLocaleDateString([], { weekday: 'short' });
      const avgAqi = Math.round(aqiList.reduce((a, b) => a + b, 0) / aqiList.length);
      const maxAqi = Math.round(Math.max(...aqiList));
      const minAqi = Math.round(Math.min(...aqiList));

      daily.push({
        date: dayStr,
        dayName,
        avgAqi,
        maxAqi,
        minAqi,
        dominantPollutant: 'PM2.5',
        category: getAQICategory(avgAqi),
      });
    }

    const combined: AirQualityCombinedData = {
      location,
      current: currentAQ,
      weather: currentW,
      hourly,
      daily,
      lastUpdated: new Date().toLocaleTimeString(),
      isLive: true,
    };

    cache.set(cacheKey, { data: combined, timestamp: now });
    return combined;
  } catch (error) {
    console.error('Error fetching live data from Open-Meteo:', error);
    throw error;
  }
}

export async function searchCitiesGeocoding(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  // First check local popular Indian cities for instantaneous results
  const qLower = query.toLowerCase().trim();
  const localMatches = POPULAR_INDIAN_CITIES.filter(
    c => c.name.toLowerCase().includes(qLower) || (c.state && c.state.toLowerCase().includes(qLower))
  );

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (!res.ok) return localMatches;

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return localMatches;
    }

    interface OpenMeteoGeocodingItem {
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }

    const apiMatches: CityLocation[] = data.results.map((r: OpenMeteoGeocodingItem) => ({
      name: r.name,
      state: r.admin1 || r.country,
      country: r.country || 'India',
      latitude: r.latitude,
      longitude: r.longitude,
      isPopular: false,
    }));

    // Deduplicate with local matches
    const combined = [...localMatches];
    for (const match of apiMatches) {
      if (!combined.some(c => Math.abs(c.latitude - match.latitude) < 0.1 && Math.abs(c.longitude - match.longitude) < 0.1)) {
        combined.push(match);
      }
    }

    return combined.slice(0, 10);
  } catch (err) {
    console.error('Geocoding search failed, returning local matches:', err);
    return localMatches;
  }
}

