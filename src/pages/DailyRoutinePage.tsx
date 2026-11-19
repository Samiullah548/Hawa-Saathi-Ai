import React, { useState } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { UserPreferences, HouseholdProfileType, ActivityType, TimeOfDay } from '../types/user';
import { AIRoutinePlan } from '../types/ai';
import { fetchAIRoutinePlan } from '../services/geminiClient';
import {
  CalendarClock,
  Sparkles,
  RefreshCw,
  Sun,
  Sunset,
  Moon,
  Clock,
  ShieldAlert,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Info,
} from 'lucide-react';

interface DailyRoutinePageProps {
  data: AirQualityCombinedData;
  preferences: UserPreferences;
}

const ACTIVITIES: ActivityType[] = [
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

const TIME_OPTIONS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

export const DailyRoutinePage: React.FC<DailyRoutinePageProps> = ({
  data,
  preferences,
}) => {
  const [activity, setActivity] = useState<ActivityType>('Morning Walk / Jog');
  const [preferredTime, setPreferredTime] = useState<TimeOfDay>('Morning');
  const [profile, setProfile] = useState<HouseholdProfileType>(preferences.householdProfile || 'General Adult');

  const [routinePlan, setRoutinePlan] = useState<AIRoutinePlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const plan = await fetchAIRoutinePlan(
        {
          city: data.location.name,
          activity,
          preferredOutdoorTime: preferredTime,
          householdProfile: profile,
          currentAqi: data.current.aqi,
        },
        preferences.customGeminiApiKey
      );
      setRoutinePlan(plan);
    } catch (err) {
      console.error('Failed to generate daily routine plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    generatePlan();
  }, [data.location.name, activity, preferredTime, profile]);

  const handleCopy = () => {
    if (!routinePlan) return;
    const text = `🌿 HawaSaathi AI Daily Routine — ${routinePlan.city}
Date: ${routinePlan.date} | Target: ${routinePlan.householdProfile}
Overall Advisory: ${routinePlan.overallAdvisory}

${routinePlan.routine
  .map(
    (r) =>
      `• [${r.timeBlock} (${r.timeRange})]: ${r.recommendedActivity}\n  Risk: ${r.pollutionRisk} | Instructions: ${r.safetyInstructions}\n  Reason: ${r.scientificReason}\n  Indoor Alternative: ${r.alternativeIndoorOption}`
  )
  .join('\n\n')}

Key Takeaway: ${routinePlan.keySafetyTakeaway}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Severe':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'High':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <CalendarClock className="w-4 h-4 text-emerald-600" />
          <span>Hourly Dispersion Modeling</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Smart Daily Routine Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Coordinate outdoor fitness, errands, and work commutes with real-time pollution windows and thermal inversion patterns in {data.location.name}.
        </p>
      </div>

      {/* Generator Controls */}
      <div className="dashboard-card p-6 border-slate-200/90 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Profile
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as HouseholdProfileType)}
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
              Primary Outdoor Activity
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {ACTIVITIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Preferred Outdoor Window
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value as TimeOfDay)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Current Air: US AQI {data.current.aqi} ({data.current.aqiCategory}) in {data.location.name}
          </span>
          <button
            onClick={generatePlan}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 transition text-xs shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Recalculating...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      {/* Routine Plan Render */}
      {routinePlan && (
        <div className="space-y-6">
          {/* Plan Summary Card */}
          <div className="dashboard-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-emerald-50/20 border-emerald-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Customized Daily Plan • {routinePlan.date}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {routinePlan.overallAdvisory}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Schedule</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                  title="Print Routine"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {routinePlan.routine.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {slot.timeBlock === 'Morning' && <Sun className="w-4 h-4 text-amber-600" />}
                        {slot.timeBlock === 'Afternoon' && <Sun className="w-4 h-4 text-emerald-600" />}
                        {slot.timeBlock === 'Evening' && <Sunset className="w-4 h-4 text-purple-600" />}
                        {slot.timeBlock === 'Night' && <Moon className="w-4 h-4 text-indigo-600" />}
                        <span className="font-extrabold text-sm text-slate-900">
                          {slot.timeBlock}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ({slot.timeRange})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(
                          slot.pollutionRisk
                        )}`}
                      >
                        Risk: {slot.pollutionRisk}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-emerald-800 mt-3">
                      {slot.recommendedActivity}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {slot.safetyInstructions}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="text-slate-500 leading-snug">
                      <strong className="text-slate-700">Atmospheric Reason: </strong>
                      {slot.scientificReason}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                      <strong className="text-slate-800">Indoor Alternative: </strong>
                      {slot.alternativeIndoorOption}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Safety Takeaway */}
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-950 font-bold mb-0.5">
                  Core Golden Rule for Today:
                </strong>
                <span>{routinePlan.keySafetyTakeaway}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

