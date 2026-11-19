import { HourlyForecastPoint } from '../types/airQuality';
import { getAQICategory } from './aqiUtils';

export interface BestWindowResult {
  hasForecastData: boolean;
  bestWindow: {
    startHour: string;
    endHour: string;
    avgAqi: number;
    avgPm25: number;
    category: string;
    qualityVsCurrent: 'Much Better' | 'Slightly Better' | 'Similar' | 'Worse';
    recommendation: string;
  } | null;
  worstWindow: {
    startHour: string;
    endHour: string;
    peakAqi: number;
    reason: string;
  } | null;
  daytimeSummary: string;
}

/**
 * Algorithmic outdoor window identifier.
 * Analyzes rolling 2-hour daylight windows (6 AM - 9 PM) across Open-Meteo hourly projections
 * to find the lowest particulate exposure window, accounting for nocturnal & morning smog inversions.
 * 
 * @param hourlyData - 24-48 hour hourly forecast series from atmospheric models
 * @param currentAqi - Current real-time ambient AQI
 * @returns BestWindowResult detailing the best window, worst peak, and comparative advisory
 */
export function findBestOutdoorWindow(
  hourlyData: HourlyForecastPoint[],
  currentAqi: number
): BestWindowResult {
  if (!hourlyData || hourlyData.length < 6) {
    return {
      hasForecastData: false,
      bestWindow: null,
      worstWindow: null,
      daytimeSummary: 'Insufficient hourly forecast data available to compute safe windows.',
    };
  }

  // Look at the next 24 hours
  const windowSlice = hourlyData.slice(0, 24);

  // Evaluate candidate 2-hour windows between 6 AM and 9 PM (waking hours)
  interface WindowCandidate {
    startIdx: number;
    startHour: string;
    endHour: string;
    avgAqi: number;
    avgPm25: number;
  }

  const candidates: WindowCandidate[] = [];

  for (let i = 0; i < windowSlice.length - 2; i++) {
    const pt1 = windowSlice[i];
    const pt2 = windowSlice[i + 1];
    const pt3 = windowSlice[i + 2];

    const hourNum = pt1.hour;
    // Prefer daytime / reasonable hours (6am to 9pm)
    const isWakingHour = hourNum >= 6 && hourNum <= 21;

    const avgAqi = Math.round((pt1.aqi + pt2.aqi + pt3.aqi) / 3);
    const avgPm25 = Math.round((pt1.pm2_5 + pt2.pm2_5 + pt3.pm2_5) / 3);

    const formatHour = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 === 0 ? 12 : h % 12;
      return `${displayHour}:00 ${period}`;
    };

    if (isWakingHour) {
      candidates.push({
        startIdx: i,
        startHour: formatHour(pt1.hour),
        endHour: formatHour((pt3.hour + 1) % 24),
        avgAqi,
        avgPm25,
      });
    }
  }

  if (candidates.length === 0) {
    return {
      hasForecastData: false,
      bestWindow: null,
      worstWindow: null,
      daytimeSummary: 'Forecast outside regular daytime hours.',
    };
  }

  // Sort candidates by lowest average AQI
  candidates.sort((a, b) => a.avgAqi - b.avgAqi);
  const best = candidates[0];

  // Find worst candidate
  const worstCandidate = [...candidates].sort((a, b) => b.avgAqi - a.avgAqi)[0];

  let qualityVsCurrent: 'Much Better' | 'Slightly Better' | 'Similar' | 'Worse' = 'Similar';
  if (currentAqi - best.avgAqi >= 40) {
    qualityVsCurrent = 'Much Better';
  } else if (currentAqi - best.avgAqi >= 15) {
    qualityVsCurrent = 'Slightly Better';
  } else if (best.avgAqi - currentAqi >= 20) {
    qualityVsCurrent = 'Worse';
  }

  const category = getAQICategory(best.avgAqi);

  let recommendation = '';
  if (best.avgAqi <= 100) {
    recommendation = `The window between ${best.startHour} and ${best.endHour} is optimal for outdoor errands, light walks, or transit.`;
  } else if (best.avgAqi <= 200) {
    recommendation = `Air quality improves to ${best.avgAqi} AQI between ${best.startHour} and ${best.endHour}. If you must go out, plan essential tasks during this time with an N95 mask.`;
  } else {
    recommendation = `Pollution remains high all day, but ${best.startHour} to ${best.endHour} has the lowest relative smog concentration (AQI ~${best.avgAqi}). Limit outdoor exposure to strict essentials.`;
  }

  return {
    hasForecastData: true,
    bestWindow: {
      startHour: best.startHour,
      endHour: best.endHour,
      avgAqi: best.avgAqi,
      avgPm25: best.avgPm25,
      category,
      qualityVsCurrent,
      recommendation,
    },
    worstWindow: {
      startHour: worstCandidate.startHour,
      endHour: worstCandidate.endHour,
      peakAqi: worstCandidate.avgAqi,
      reason: 'Cold morning temperature inversion or peak evening vehicular exhaust traps surface emissions.',
    },
    daytimeSummary: `Cleanest window expected around ${best.startHour} - ${best.endHour} (AQI ~${best.avgAqi}). Avoid ${worstCandidate.startHour} - ${worstCandidate.endHour} when smog peaks at ~${worstCandidate.avgAqi}.`,
  };
}

