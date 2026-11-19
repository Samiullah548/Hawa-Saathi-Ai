import { AISafetyRecommendation, AIRoutinePlan, RoutineItem } from '../src/types/ai';
import { HouseholdProfileType, ActivityType, TimeOfDay } from '../src/types/user';
import { getAQICategory } from '../src/utils/aqiUtils';

export function generateDeterministicRecommendations(params: {
  aqi: number;
  pm2_5: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  activity: ActivityType;
  householdProfile: HouseholdProfileType;
  timeOfDay: TimeOfDay;
  cityName: string;
}): AISafetyRecommendation {
  const {
    aqi,
    pm2_5,
    temperature,
    humidity,
    activity,
    householdProfile,
    timeOfDay,
    cityName,
  } = params;

  const category = getAQICategory(aqi);

  // Compute suitability score (1-10)
  let score = 10;
  if (aqi > 300) score = 1;
  else if (aqi > 200) score = 2;
  else if (aqi > 150) score = 4;
  else if (aqi > 100) score = 6;
  else if (aqi > 50) score = 8;

  // Profile-specific adjustment
  const isVulnerable = householdProfile === 'Child' || householdProfile === 'Elderly Person' || householdProfile === 'Sensitive Individual';
  if (isVulnerable && aqi > 100) {
    score = Math.max(1, score - 2);
  }

  // Activity-specific adjustment (cardio vs stationary)
  const isHighExertion = activity === 'Morning Walk / Jog' || activity === 'Cycling' || activity === 'Outdoor Work / Labor';
  if (isHighExertion && aqi > 120) {
    score = Math.max(1, score - 2);
  }

  // Safety Verdict
  let safetyVerdict: AISafetyRecommendation['safetyVerdict'] = 'Safe';
  if (score <= 2) safetyVerdict = 'Dangerous';
  else if (score <= 4) safetyVerdict = 'Unsafe';
  else if (score <= 7) safetyVerdict = 'Caution Required';

  // Headlines
  let headline = `Air conditions in ${cityName} are favorable for your selected routine.`;
  if (safetyVerdict === 'Dangerous') {
    headline = `Severe Smog Alert for ${cityName} (AQI ${aqi}): Outdoor exertion is hazardous for ${householdProfile}.`;
  } else if (safetyVerdict === 'Unsafe') {
    headline = `High Pollution Advisory: Outdoor activities should be restricted for ${householdProfile}.`;
  } else if (safetyVerdict === 'Caution Required') {
    headline = `Moderate Air Quality: Take sensible precautions during prolonged outdoor transit.`;
  }

  // Outdoor Guidance
  let outdoorGuidance = '';
  let outdoorExplanation = '';
  if (safetyVerdict === 'Dangerous') {
    outdoorGuidance = `Cancel all outdoor physical activities including ${activity}. Limit outdoor time strictly to emergency transit.`;
    outdoorExplanation = `Current PM2.5 levels of ${pm2_5} µg/m³ exceed the WHO safety guideline (15 µg/m³) by over ${Math.round(pm2_5 / 15)}x. High-intensity respiration forces millions of microscopic soot particles into the bloodstream.`;
  } else if (safetyVerdict === 'Unsafe') {
    outdoorGuidance = `Avoid intense outdoor exertion. Shift ${activity} to an indoor ventilated or purified environment.`;
    outdoorExplanation = `Ambient particulate concentrations are high enough to trigger acute throat irritation, bronchospasms, and reduced oxygen saturation, especially in ${timeOfDay.toLowerCase()} cool air.`;
  } else if (safetyVerdict === 'Caution Required') {
    outdoorGuidance = `Light outdoor activities are permissible with care. Avoid strenuous sustained cardio on busy roads.`;
    outdoorExplanation = `Sensitive airways will react to moderate particulate and ozone levels. Maintain relaxed pacing and stay hydrated.`;
  } else {
    outdoorGuidance = `Outdoor conditions are clean and welcoming for ${activity}. Enjoy your time outside!`;
    outdoorExplanation = `Ambient pollutants are well within safe thresholds. Natural airflow promotes healthy oxygenation and circadian balance.`;
  }

  // Exercise Guidance
  let exerciseGuidance = '';
  if (isHighExertion) {
    if (aqi > 150) {
      exerciseGuidance = `Replace outdoor ${activity} with indoor yoga, resistance training, or stationary cycling in a room with an air purifier. Deep breathing outdoors during high smog causes up to 10x higher particulate deposition in the lung parenchyma.`;
    } else if (aqi > 100) {
      exerciseGuidance = `Reduce workout intensity. Keep duration under 30 minutes, or reschedule to early afternoon when sunlight elevates the atmospheric boundary layer.`;
    } else {
      exerciseGuidance = `Safe for outdoor fitness! Take full advantage of clean conditions for your cardiovascular session.`;
    }
  } else {
    exerciseGuidance = aqi > 200
      ? `Even sedentary outdoor tasks should be minimized. Wear a sealed N95 respirator if traveling.`
      : `Routine commutes and light tasks are fine with basic seasonal awareness.`;
  }

  // Mask Recommendation
  let maskRecommended = aqi > 100 || isVulnerable;
  let maskType: AISafetyRecommendation['maskRecommendation']['maskType'] = 'None needed';
  let maskDetails = 'Ambient air quality does not require respiratory protective equipment.';

  if (aqi > 250) {
    maskRecommended = true;
    maskType = 'N95 / FFP2 / KN95';
    maskDetails = `Strictly wear a certified, well-fitted N95 or FFP2 respirator. Standard surgical or cloth masks fail to filter sub-micron PM2.5 particulates.`;
  } else if (aqi > 130) {
    maskRecommended = true;
    maskType = 'N95 / FFP2 / KN95';
    maskDetails = `N95 respirator strongly advised for ${householdProfile} during transit and outdoor exposure.`;
  } else if (aqi > 80 && isVulnerable) {
    maskRecommended = true;
    maskType = 'Surgical / Cloth (Minimal)';
    maskDetails = `A lightweight mask helps protect sensitive respiratory passages from coarse street dust (PM10).`;
  }

  // Indoor Care Tips
  const indoorCareTips: string[] = [
    `Run certified H13 HEPA air purifiers in sleeping and primary living quarters.`,
    `Avoid burning incense (agarbatti), dhoop, or mosquito coils inside enclosed rooms.`,
    `Keep windows closed during early morning and late evening thermal inversion peaks.`,
  ];
  if (aqi > 150) {
    indoorCareTips.push(`Use damp microfiber mopping instead of dry brooms to avoid re-suspending settled micro-dust.`);
    indoorCareTips.push(`Always operate the kitchen exhaust chimney on high speed while frying or tempering spices.`);
  }

  // Ventilation Advice
  let shouldVentilate = false;
  let recommendedWindow = '1:00 PM – 3:30 PM';
  let ventDetails = '';

  if (aqi <= 80) {
    shouldVentilate = true;
    recommendedWindow = 'Open throughout daytime hours';
    ventDetails = 'Outdoor air is fresh. Open opposing windows for cross-ventilation to flush out indoor CO2.';
  } else if (aqi <= 180) {
    shouldVentilate = true;
    recommendedWindow = '1:00 PM – 3:30 PM (Peak Solar Mixing)';
    ventDetails = 'Ventilate for 20-30 minutes only in the early afternoon when solar heating breaks the morning smog blanket. Run air purifiers immediately afterward.';
  } else {
    shouldVentilate = false;
    recommendedWindow = 'Keep sealed until AQI drops below 200';
    ventDetails = 'Keep all windows tightly closed. Hazardous outdoor ambient particulate levels will quickly saturate your indoor living spaces.';
  }

  // Vulnerable group alert
  let vulnerableGroupAlert = '';
  if (householdProfile === 'Child') {
    vulnerableGroupAlert = `Children breathe more air per kilogram of body weight than adults and their developing lungs are especially vulnerable to PM2.5 inflammation. School outdoor sports should be suspended when AQI exceeds 150.`;
  } else if (householdProfile === 'Elderly Person') {
    vulnerableGroupAlert = `Elderly individuals have reduced cardiovascular reserve. Elevated PM2.5 triggers arterial vasoconstriction and systemic inflammation, increasing the incidence of cardiac arrhythmias and COPD flare-ups.`;
  } else if (householdProfile === 'Sensitive Individual') {
    vulnerableGroupAlert = `Keep rescue bronchodilator inhalers readily accessible. Pre-emptive anti-inflammatory steam inhalation and warm saline gargling are recommended before bed.`;
  } else if (householdProfile === 'Outdoor Worker') {
    vulnerableGroupAlert = `Prolonged physical shifts in high smog require mandatory N95 respirators replaced every 8 hours. Drink at least 3 liters of warm fluids daily to support mucosal clearance.`;
  } else {
    vulnerableGroupAlert = `Healthy adults can still suffer cumulative vascular and pulmonary micro-damage during prolonged smog exposure. Limit sustained outdoor cardio.`;
  }

  // Scientific explanation
  const scientificExplanation = `Current atmospheric conditions in ${cityName} (${temperature}°C, ${humidity}% humidity) indicate ${
    temperature < 18 ? 'cold winter air boundary conditions that trap vehicular and industrial soot close to the ground' : 'moderate atmospheric mixing'
  }. PM2.5 particles are small enough to pass past the nasal nasal cilia and enter capillary beds directly, elevating systemic oxidative stress.`;

  return {
    safetyVerdict,
    suitabilityScore: score,
    headline,
    outdoorGuidance,
    outdoorExplanation,
    exerciseGuidance,
    maskRecommendation: {
      recommended: maskRecommended,
      maskType,
      details: maskDetails,
    },
    indoorCareTips,
    ventilationAdvice: {
      shouldVentilate,
      recommendedWindow,
      details: ventDetails,
    },
    vulnerableGroupAlert,
    scientificExplanation,
    disclaimer: 'This recommendation is generated for environmental awareness and exposure reduction based on CPCB & WHO air quality standards. It does not constitute a formal medical diagnosis. Consult a qualified healthcare professional for individualized clinical management.',
  };
}

export function generateDeterministicRoutine(params: {
  city: string;
  activity: ActivityType;
  preferredOutdoorTime: TimeOfDay;
  householdProfile: HouseholdProfileType;
  currentAqi: number;
}): AIRoutinePlan {
  const { city, activity, preferredOutdoorTime, householdProfile, currentAqi } = params;

  const isSevere = currentAqi > 250;
  const isHigh = currentAqi > 150;

  const routine: RoutineItem[] = [
    {
      timeBlock: 'Morning',
      timeRange: '06:00 AM – 10:00 AM',
      recommendedActivity: isSevere 
        ? 'Indoor stretching, breathing exercises, and warm hydration' 
        : (isHigh ? 'Indoor workout; delay outdoor walks until noon' : 'Brisk walk or light jogging'),
      pollutionRisk: isSevere ? 'Severe' : (isHigh ? 'High' : 'Moderate'),
      safetyInstructions: isSevere
        ? 'Strictly keep windows and doors sealed. Cold morning air traps vehicular exhaust and biomass smoke at human breathing height.'
        : 'If stepping outside for commute, wear an N95 respirator. Drink warm water with lemon or ginger.',
      scientificReason: 'Nocturnal radiation cooling forms a shallow temperature inversion layer, concentrating surface PM2.5 into thick ground smog.',
      alternativeIndoorOption: 'Indoor mat pilates, yoga asanas (Surya Namaskar), or resistance band training.',
    },
    {
      timeBlock: 'Afternoon',
      timeRange: '12:00 PM – 04:00 PM',
      recommendedActivity: isSevere
        ? 'Essential outdoor errands with N95 mask; brief window ventilation'
        : 'Preferred window for outdoor commute, errands, and walking',
      pollutionRisk: isSevere ? 'High' : 'Moderate',
      safetyInstructions: 'This is usually the cleanest window of the 24-hour cycle. Complete necessary outdoor appointments and air out the home for 20 minutes if needed.',
      scientificReason: 'Solar radiation warms the ground surface, lifting the atmospheric boundary layer and allowing surface particulates to disperse upward.',
      alternativeIndoorOption: 'Working from desk near a certified HEPA air purifier.',
    },
    {
      timeBlock: 'Evening',
      timeRange: '05:00 PM – 08:30 PM',
      recommendedActivity: 'Indoor family time, reading, or home gym sessions',
      pollutionRisk: isSevere ? 'Severe' : 'High',
      safetyInstructions: 'Avoid outdoor exercise near major arterial roads during peak rush-hour traffic. Seal windows before twilight.',
      scientificReason: 'Evening rush-hour emissions spike sharply while ambient temperatures plunge, recreating the thermal inversion lid.',
      alternativeIndoorOption: 'Stationary treadmill or bodyweight circuit at home.',
    },
    {
      timeBlock: 'Night',
      timeRange: '09:00 PM – 06:00 AM',
      recommendedActivity: 'Restful sleep with continuous HEPA air filtration',
      pollutionRisk: isSevere ? 'Severe' : (isHigh ? 'High' : 'Low'),
      safetyInstructions: 'Run air purifier on silent/sleep mode close to bed. Keep bedroom door and windows latched. Use a saline nasal rinse before bed.',
      scientificReason: 'During 7-8 hours of sleep, continuous exposure to unpurified air causes nocturnal airway inflammation and morning sinus congestion.',
      alternativeIndoorOption: 'Bedroom humidification and air purification.',
    },
  ];

  return {
    city,
    date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    householdProfile,
    plannedActivity: activity,
    overallAdvisory: isSevere
      ? `Severe smog conditions in ${city}. Outdoor ${activity} during ${preferredOutdoorTime.toLowerCase()} should be deferred to indoor alternatives.`
      : `Moderate to high pollution in ${city}. Prioritize midday slots for any outdoor errands, and maintain indoor filtration.`,
    routine,
    keySafetyTakeaway: `Your best outdoor safety window is between 1:00 PM and 3:30 PM. Always check live readings on HawaSaathi AI before stepping out.`,
    disclaimer: 'Advisory routine generated based on CPCB and WHO environmental benchmarks. Not a medical prescription.',
  };
}

export function generateDeterministicChatResponse(
  message: string,
  cityContext?: { cityName: string; aqi: number }
): string {
  const m = message.toLowerCase();
  const city = cityContext?.cityName || 'your city';
  const aqi = cityContext?.aqi ?? 150;

  if (m.includes('exercise') || m.includes('run') || m.includes('jog') || m.includes('gym') || m.includes('walk')) {
    if (aqi > 200) {
      return `### Outdoor Exercise Advisory for ${city} (Current AQI: ${aqi})

**Verdict: Avoid Outdoor Exercise.**

1. **Why it's dangerous:** When exercising, you breathe 5 to 10 times more air per minute, mostly through your mouth. This bypasses the natural filtration of your nasal hairs and delivers toxic PM2.5 directly into deep lung tissue.
2. **Safe Alternatives:**
   - Indoor workouts (Yoga, Pilates, bodyweight training, dumbbell circuits).
   - Exercise in an enclosed room with an active HEPA air purifier.
3. **If you must walk outdoors:** Wait until the early afternoon (1:00 PM - 3:30 PM) when ground smog is lowest, keep exertion light, and wear a fitted N95 mask.

*Note: For individuals with asthma or cardiovascular issues, outdoor exercise above 150 AQI is strictly discouraged.*`;
    } else {
      return `### Outdoor Exercise Guidance for ${city} (Current AQI: ${aqi})

Outdoor exercise is **permissible with caution**:
- **Timing:** Early afternoon (12 PM - 4 PM) has the best atmospheric dispersion. Avoid early morning (6 AM - 8 AM) smog traps.
- **Location:** Exercise in parks or green areas away from heavy vehicular traffic corridors.
- **Sensitive Individuals:** If you experience coughing, throat irritation, or shortness of breath, move your session indoors.`;
    }
  }

  if (m.includes('mask') || m.includes('n95') || m.includes('cloth') || m.includes('surgical')) {
    return `### Mask Guide for Urban Smog Protection

1. **N95 / FFP2 / KN95 (Highly Recommended):**
   - Filters at least 95% of airborne particles down to 0.3 microns, including ultra-fine PM2.5.
   - **Key Requirement:** Must form an airtight seal around your nose and chin. Check for air leakage along the cheeks.

2. **Cloth Masks & Bandanas (Not Recommended for Smog):**
   - Porous woven fabrics only filter large dust particles (>10 microns). Microscopic PM2.5 passes straight through the fabric pores.

3. **Surgical Masks (Minimal Protection):**
   - Good for droplet protection, but loose edges allow ambient smog to leak in from the sides without filtration.

**Pro-Tip:** Replace N95 respirators every 30-40 hours of cumulative wear, or sooner if the filter becomes discolored with street soot.`;
  }

  if (m.includes('purifier') || m.includes('filter') || m.includes('indoor') || m.includes('cadr')) {
    return `### Indoor Air Quality & Air Purifier Essentials

1. **Look for True HEPA (H13 or H14):**
   - Filters 99.97% of particles down to 0.3 microns. Avoid "HEPA-type" or ionizer-only devices that produce ozone.
2. **CADR (Clean Air Delivery Rate):**
   - Ensure the CADR rating matches or exceeds your room volume. As a rule of thumb: CADR in m³/h should be at least $5 \\times \\text{room area (m}^2\\text{)}$.
3. **Pre-Filter Maintenance:**
   - Vacuum or wash the outer mesh pre-filter every 2-3 weeks to prevent coarse hair and dust from clogging the expensive HEPA layer.
4. **Placement Tips:**
   - Keep the purifier 1-2 feet away from walls in the center of airflow, preferably near the head of the bed for sleeping protection.`;
  }

  if (m.includes('child') || m.includes('baby') || m.includes('kid') || m.includes('school')) {
    return `### Protecting Children from Severe Smog

Children are uniquely vulnerable to air pollution for three biological reasons:
1. **Higher Breathing Rate:** Kids inhale more air relative to their body weight compared to adults.
2. **Developing Lungs:** Alveolar growth continues until approximately 8-10 years of age.
3. **Closer to Ground:** Ground-level particulate concentrations are denser at a child's height.

**Recommended Actions:**
- Advocate for schools to shift morning sports indoors during high smog warnings (AQI > 200).
- Equip children with child-sized N95/KF94 masks with adjustable ear loops.
- Encourage saline nasal drops and plenty of warm water to soothe irritated mucous membranes.`;
  }

  if (m.includes('plant') || m.includes('snake plant') || m.includes('areca') || m.includes('nasa')) {
    return `### The Truth About Indoor Plants & Air Quality

- **The NASA Study Context:** NASA's famous 1989 clean air study was conducted in small, hermetically sealed chambers over weeks, focusing on volatile organic chemicals (VOCs like benzene and formaldehyde).
- **The Reality in Real Homes:** In a normal room with natural air exchange, you would need **10 to 100 plants per square meter** to replicate the particulate filtration of a single modest HEPA air purifier!
- **Value of Plants:** Houseplants (Snake Plant, Spider Plant, Areca Palm) are wonderful for **humidity regulation, psychological well-being, and daytime oxygen release**, but **they do NOT eliminate microscopic PM2.5 soot**. Use plants to complement, not replace, mechanical HEPA filtration.`;
  }

  // General helpful response
  return `### Air Quality Advisory for ${city} (Current AQI: ${aqi})

Here is how you can protect yourself and your family right now:

1. **Current Status:** Air quality is **${getAQICategory(aqi)}** (AQI ${aqi}). The primary driver is fine particulate matter (PM2.5).
2. **Outdoor Protocol:** Wear an airtight N95/FFP2 respirator during transit. Reschedule outdoor cardio workouts to indoor settings.
3. **Indoor Protocol:** Run your HEPA air purifier, keep windows sealed during early morning cold inversion hours, and use kitchen exhaust fans while cooking.
4. **Hydration & Recovery:** Drink warm fluids, herbal teas, or ginger-turmeric water to reduce respiratory tract inflammation.

*Feel free to ask me about specific travel times, mask fitting, indoor DIY purification, or commute emission comparisons!*`;
}

