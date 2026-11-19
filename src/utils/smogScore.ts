// Smog Survival Score Algorithm & Transparency Engine

export interface SmogScoreBreakdownItem {
  name: string;
  pointsEarned: number;
  maxPoints: number;
  status: 'active' | 'missing';
  tip: string;
}

export interface SmogScoreResult {
  score: number; // 0 - 100
  tier: 'Fortified Shield' | 'Well Protected' | 'Moderate Protection' | 'High Vulnerability';
  tierColor: string;
  badgeBg: string;
  environmentPoints: number;
  actionPoints: number;
  breakdown: SmogScoreBreakdownItem[];
  verdict: string;
  keyRecommendation: string;
}

export interface SmogProtectionActions {
  hasAirPurifier: boolean;
  hasN95Masks: boolean;
  keepsWindowsClosedAtPeak: boolean;
  usesExhaustWhileCooking: boolean;
  staysHydrated: boolean;
  monitorsDailyAQI: boolean;
}

/**
 * Calculates a composite 0-100 Smog Survival Score based on ambient pollution stress (40 pts)
 * combined with proven active mitigation measures (60 pts).
 * 
 * @param aqi - Real-time US Air Quality Index
 * @param actions - User's protective measures (HEPA, N95, ventilation timing, exhaust, hydration, daily monitoring)
 * @returns SmogScoreResult containing overall score, tier, itemized breakdown, and actionable suggestions
 */
export function calculateSmogSurvivalScore(
  aqi: number,
  actions: SmogProtectionActions
): SmogScoreResult {
  // 1. Environmental Air Quality Baseline (Max 40 Points)
  let environmentPoints = 0;
  if (aqi <= 50) environmentPoints = 40;
  else if (aqi <= 100) environmentPoints = 32;
  else if (aqi <= 150) environmentPoints = 24;
  else if (aqi <= 200) environmentPoints = 16;
  else if (aqi <= 300) environmentPoints = 8;
  else environmentPoints = 2; // Severe winter smog (AQI > 300)

  // 2. Household & Personal Action Points (Max 60 Points)
  const breakdown: SmogScoreBreakdownItem[] = [
    {
      name: 'HEPA Air Purifier In Use',
      pointsEarned: actions.hasAirPurifier ? 15 : 0,
      maxPoints: 15,
      status: actions.hasAirPurifier ? 'active' : 'missing',
      tip: actions.hasAirPurifier
        ? 'Active HEPA H13 filtration removes up to 99.97% of indoor PM2.5.'
        : 'Running an H13 HEPA purifier cuts indoor PM2.5 concentrations by 60-80%.',
    },
    {
      name: 'N95 / FFP2 Masks Available & Worn',
      pointsEarned: actions.hasN95Masks ? 12 : 0,
      maxPoints: 12,
      status: actions.hasN95Masks ? 'active' : 'missing',
      tip: actions.hasN95Masks
        ? 'N95 masks with tight facial seals filter microscopic particles under 2.5 microns.'
        : 'Cloth and surgical masks do not adequately seal against ultra-fine PM2.5 smog.',
    },
    {
      name: 'Windows Sealed During Smog Peaks',
      pointsEarned: actions.keepsWindowsClosedAtPeak ? 10 : 0,
      maxPoints: 10,
      status: actions.keepsWindowsClosedAtPeak ? 'active' : 'missing',
      tip: actions.keepsWindowsClosedAtPeak
        ? 'Preventing nocturnal and early morning smog ingress keeps indoor air stable.'
        : 'Closing windows between 6 AM - 10 AM and after sunset prevents cold air pollution traps.',
    },
    {
      name: 'Exhaust Fan / Chimney for Cooking',
      pointsEarned: actions.usesExhaustWhileCooking ? 8 : 0,
      maxPoints: 8,
      status: actions.usesExhaustWhileCooking ? 'active' : 'missing',
      tip: actions.usesExhaustWhileCooking
        ? 'Proper exhaust ventilation expels oil fumes, NOx, and ultra-fine cooking soot.'
        : 'Unventilated frying or tadka creates massive indoor PM2.5 spikes often exceeding 300 µg/m³.',
    },
    {
      name: 'Hydration & Saline Nasal Rinse',
      pointsEarned: actions.staysHydrated ? 7 : 0,
      maxPoints: 7,
      status: actions.staysHydrated ? 'active' : 'missing',
      tip: actions.staysHydrated
        ? 'Warm fluids and mucous hydration keep natural respiratory cilia working properly.'
        : 'Drink warm water and herbal teas to soothe irritated mucous membranes.',
    },
    {
      name: 'Daily AQI Forecasting Habits',
      pointsEarned: actions.monitorsDailyAQI ? 8 : 0,
      maxPoints: 8,
      status: actions.monitorsDailyAQI ? 'active' : 'missing',
      tip: actions.monitorsDailyAQI
        ? 'Checking hourly forecasts allows rescheduling high-exertion tasks to clean windows.'
        : 'Proactively planning outdoor transit around hourly AQI drops significantly reduces lifetime exposure.',
    },
  ];

  const actionPoints = breakdown.reduce((sum, item) => sum + item.pointsEarned, 0);
  const totalScore = Math.min(100, Math.max(0, environmentPoints + actionPoints));

  let tier: SmogScoreResult['tier'] = 'Moderate Protection';
  let tierColor = 'text-amber-700';
  let badgeBg = 'bg-amber-100 border-amber-200';
  let verdict = '';
  let keyRecommendation = '';

  if (totalScore >= 80) {
    tier = 'Fortified Shield';
    tierColor = 'text-emerald-700';
    badgeBg = 'bg-emerald-100 border-emerald-300';
    verdict = 'Excellent resilience! Your active protection routines counteract heavy ambient air pollution effectively.';
    keyRecommendation = 'Maintain your air purifier filters and check hourly forecast updates before outdoor workouts.';
  } else if (totalScore >= 65) {
    tier = 'Well Protected';
    tierColor = 'text-teal-700';
    badgeBg = 'bg-teal-100 border-teal-300';
    verdict = 'Solid safety baseline, but minor exposure gaps remain during peak outdoor pollution periods.';
    keyRecommendation = 'Ensure N95 masks fit snugly with no cheek leakage and run air purifiers on high mode during sleep.';
  } else if (totalScore >= 45) {
    tier = 'Moderate Protection';
    tierColor = 'text-orange-700';
    badgeBg = 'bg-orange-100 border-orange-300';
    verdict = 'Caution: Current ambient smog levels pose a significant health burden without additional protective measures.';
    keyRecommendation = 'Upgrade to sealed N95 masks and restrict natural ventilation to afternoon sunny periods.';
  } else {
    tier = 'High Vulnerability';
    tierColor = 'text-rose-700';
    badgeBg = 'bg-rose-100 border-rose-300';
    verdict = 'High Risk: Low ambient air quality combined with missing protective habits increases acute respiratory vulnerability.';
    keyRecommendation = 'Immediately adopt N95 masks for outdoor transit, seal bedroom windows, and avoid early morning walks.';
  }

  return {
    score: totalScore,
    tier,
    tierColor,
    badgeBg,
    environmentPoints,
    actionPoints,
    breakdown,
    verdict,
    keyRecommendation,
  };
}

