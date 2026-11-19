import React, { useState } from 'react';
import { UserPreferences, HouseholdProfileType, ActivityType } from '../types/user';
import { CityLocation } from '../types/airQuality';
import { POPULAR_INDIAN_CITIES } from '../services/openMeteo';
import {
  clearAllUserData,
  savePreferences,
} from '../services/storage';
import {
  requestNotificationPermission,
  getNotificationStatus,
} from '../services/notificationService';
import {
  Settings,
  User,
  MapPin,
  Bell,
  Key,
  Trash2,
  Check,
  ShieldCheck,
  Activity,
  Layers,
  Info,
} from 'lucide-react';

interface SettingsPageProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onSelectCity: (city: CityLocation) => void;
}

const ALL_ACTIVITIES: ActivityType[] = [
  'Morning Walk / Jog',
  'Cycling',
  'Outdoor Work / Labor',
  'Office Commute',
  'School / Playground',
  'Indoor Fitness',
  'General Errand',
];

const PROFILES: HouseholdProfileType[] = [
  'General Adult',
  'Child',
  'Elderly Person',
  'Sensitive Individual',
  'Outdoor Worker',
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferences,
  onUpdatePreferences,
  onSelectCity,
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>(preferences);
  const [apiKeyInput, setApiKeyInput] = useState<string>(preferences.customGeminiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [notifStatus, setNotifStatus] = useState(getNotificationStatus());

  const handleSave = () => {
    const updated: UserPreferences = {
      ...prefs,
      customGeminiApiKey: apiKeyInput.trim(),
    };
    setPrefs(updated);
    onUpdatePreferences(updated);
    savePreferences(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleActivity = (act: ActivityType) => {
    const current = prefs.primaryActivities;
    const exists = current.includes(act);
    const updated = exists ? current.filter((a) => a !== act) : [...current, act];
    setPrefs({ ...prefs, primaryActivities: updated });
  };

  const handleRequestNotifications = async () => {
    try {
      const perm = await requestNotificationPermission();
      setNotifStatus({ isSupported: true, permission: perm });
      if (perm === 'granted') {
        const updated = { ...prefs, notificationsEnabled: true };
        setPrefs(updated);
        onUpdatePreferences(updated);
        savePreferences(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all saved local preferences, checklists, and chat history?')) {
      clearAllUserData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Preferences & Data Governance</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Application Settings & Onboarding
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All settings are stored locally on your device in LocalStorage. No account or sign-in required.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile & Default City */}
        <div className="dashboard-card p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Personal & Household Identity
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Household Profile
            </label>
            <select
              value={prefs.householdProfile}
              onChange={(e) =>
                setPrefs({ ...prefs, householdProfile: e.target.value as HouseholdProfileType })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {PROFILES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Default Preferred City
            </label>
            <select
              value={prefs.defaultCity.name}
              onChange={(e) => {
                const found = POPULAR_INDIAN_CITIES.find((c) => c.name === e.target.value);
                if (found) {
                  setPrefs({ ...prefs, defaultCity: found });
                  onSelectCity(found);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {POPULAR_INDIAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Measurement Units
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, units: 'metric' })}
                className={`py-2 rounded-xl border font-bold transition ${
                  prefs.units === 'metric'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Metric (°C, km/h, µg/m³)
              </button>
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, units: 'imperial' })}
                className={`py-2 rounded-xl border font-bold transition ${
                  prefs.units === 'imperial'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Imperial (°F, mph)
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Thresholds */}
        <div className="dashboard-card p-6 space-y-5">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              AQI Alerts & Web Notifications
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Browser Push Notifications:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  notifStatus.permission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {notifStatus.permission}
              </span>
            </div>
            <p className="text-slate-500">
              Receive browser notifications when ambient AQI crosses your chosen safety threshold.
            </p>
            {notifStatus.permission !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestNotifications}
                className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Enable Notifications
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Alert Trigger Threshold (US AQI): {prefs.alertThreshold}
            </label>
            <input
              type="range"
              min="50"
              max="300"
              step="25"
              value={prefs.alertThreshold}
              onChange={(e) =>
                setPrefs({ ...prefs, alertThreshold: Number(e.target.value) })
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50 (Moderate)</span>
              <span>150 (Unhealthy)</span>
              <span>300 (Hazardous)</span>
            </div>
          </div>
        </div>

        {/* Primary Activities Multi-Select */}
        <div className="dashboard-card p-6 space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Primary Outdoor Activities
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Select the activities you regularly perform to calibrate your default AI recommendations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {ALL_ACTIVITIES.map((act) => {
              const isChecked = prefs.primaryActivities.includes(act);
              return (
                <button
                  key={act}
                  type="button"
                  onClick={() => handleToggleActivity(act)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{act}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Gemini API Key & Reset */}
        <div className="dashboard-card p-6 space-y-4">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <Key className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Google Gemini API Configuration
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy... (leave blank to use server key / fallback engine)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400">
              Get a free API key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline font-semibold"
              >
                Google AI Studio
              </a>
              . When unset, HawaSaathi uses its built-in CPCB & WHO deterministic expert rules.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Reset Application Data</span>
              <span className="text-[11px] text-slate-400">Clears all preferences and checklist logs</span>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
