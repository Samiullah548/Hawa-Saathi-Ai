import { CityLocation } from '../types/airQuality';
import { UserPreferences, ChecklistItem } from '../types/user';
import { ChatMessage } from '../types/ai';
import { POPULAR_INDIAN_CITIES } from './openMeteo';

const PREFS_KEY = 'hawasaathi_user_preferences_v1';
const INDOOR_CHECKLIST_KEY = 'hawasaathi_indoor_checklist_v1';
const FAMILY_CHECKLIST_KEY = 'hawasaathi_family_checklist_v1';
const CHAT_HISTORY_KEY = 'hawasaathi_chat_history_v1';
const COMMUTE_HISTORY_KEY = 'hawasaathi_commute_history_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultCity: POPULAR_INDIAN_CITIES[0], // Delhi (NCR)
  favoriteCities: [
    POPULAR_INDIAN_CITIES[0], // Delhi
    POPULAR_INDIAN_CITIES[6], // Mumbai
    POPULAR_INDIAN_CITIES[8], // Bengaluru
  ],
  householdProfile: 'General Adult',
  primaryActivities: ['Morning Walk / Jog', 'Office Commute'],
  units: 'metric',
  notificationsEnabled: false,
  alertThreshold: 150, // Unhealthy
  customGeminiApiKey: '',
  hasCompletedOnboarding: false,
  smogActionsState: {
    hasAirPurifier: true,
    hasN95Masks: true,
    keepsWindowsClosedAtPeak: true,
    usesExhaustWhileCooking: true,
    staysHydrated: true,
    monitorsDailyAQI: true,
  },
};

export const INITIAL_INDOOR_CHECKLIST: ChecklistItem[] = [
  {
    id: 'ind-1',
    title: 'Seal Window and Door Gaps',
    category: 'indoor',
    description: 'Use foam weatherstripping tape on exterior window edges to block fine PM2.5 infiltration during early morning smog spikes.',
    isCompleted: false,
    frequency: 'seasonal',
  },
  {
    id: 'ind-2',
    title: 'Inspect & Vacuum Air Purifier Pre-Filters',
    category: 'indoor',
    description: 'Vacuum the washable mesh pre-filter to prevent coarse dust from choking the internal H13 HEPA pleated layer.',
    isCompleted: false,
    frequency: 'weekly',
  },
  {
    id: 'ind-3',
    title: 'Turn On Kitchen Chimney / Exhaust Before Cooking',
    category: 'indoor',
    description: 'Turn on ventilation 2 minutes prior to frying or tempering spices to capture volatile organic compounds and oil aerosols.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'ind-4',
    title: 'Switch from Dry Sweeping to Damp Microfiber Mopping',
    category: 'indoor',
    description: 'Dry brooms aerosolize settled micro-particles back into breathing height. Damp microfiber traps PM2.5 effectively.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'ind-5',
    title: 'Avoid Agarbatti, Dhoop, and Scented Candles Indoors',
    category: 'indoor',
    description: 'Incense combustion releases heavy aromatic hydrocarbons and ultra-fine carbon soot inside enclosed rooms.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'ind-6',
    title: 'Clean Indoor Plant Foliage with Damp Cloth',
    category: 'indoor',
    description: 'Wipe dust off broad leaves (Snake Plant, Areca Palm) so stomata remain open for humidity regulation.',
    isCompleted: false,
    frequency: 'weekly',
  },
];

export const INITIAL_FAMILY_CHECKLIST: ChecklistItem[] = [
  {
    id: 'fam-1',
    title: 'Check Daily AQI Before Morning School/Work Commute',
    category: 'family',
    description: 'Look at the morning 7 AM - 9 AM index to equip children and elders with certified N95 masks.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'fam-2',
    title: 'Verify Child & Elder N95 Mask Fit (No Nose Leaks)',
    category: 'family',
    description: 'Ensure mask pinch-wire conforms to the nasal bridge with no gap on cheeks for true seal integrity.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'fam-3',
    title: 'Shift High-Intensity Cardio Workouts Indoors',
    category: 'family',
    description: 'Replace outdoor jogging with indoor bodyweight or yoga when AQI exceeds 150 to spare pulmonary alveoli.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'fam-4',
    title: 'Warm Water & Saline Gargle After Arriving Home',
    category: 'family',
    description: 'Clears deposited particulate matter from the oropharynx, reducing throat irritation and chronic tickles.',
    isCompleted: false,
    frequency: 'daily',
  },
  {
    id: 'fam-5',
    title: 'Prepare Anti-Inflammatory Fluids (Turmeric/Ginger Tea)',
    category: 'family',
    description: 'Natural antioxidants aid cellular repair against systemic oxidative stress triggered by inhaled PM2.5.',
    isCompleted: false,
    frequency: 'daily',
  },
];

export function getSavedPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch (e) {
    console.error('Failed to load preferences from storage:', e);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences to storage:', e);
  }
}

export function getIndoorChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(INDOOR_CHECKLIST_KEY);
    if (!raw) return INITIAL_INDOOR_CHECKLIST;
    return JSON.parse(raw);
  } catch {
    return INITIAL_INDOOR_CHECKLIST;
  }
}

export function saveIndoorChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(INDOOR_CHECKLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save indoor checklist:', e);
  }
}

export function getFamilyChecklist(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(FAMILY_CHECKLIST_KEY);
    if (!raw) return INITIAL_FAMILY_CHECKLIST;
    return JSON.parse(raw);
  } catch {
    return INITIAL_FAMILY_CHECKLIST;
  }
}

export function saveFamilyChecklist(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(FAMILY_CHECKLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save family checklist:', e);
  }
}

export function getSavedChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    // Keep last 30 messages
    const trimmed = messages.slice(-30);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save chat history:', e);
  }
}

export function clearAllUserData(): void {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem(INDOOR_CHECKLIST_KEY);
  localStorage.removeItem(FAMILY_CHECKLIST_KEY);
  localStorage.removeItem(CHAT_HISTORY_KEY);
  localStorage.removeItem(COMMUTE_HISTORY_KEY);
}
