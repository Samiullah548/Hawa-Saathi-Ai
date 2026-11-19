import React, { useState, useEffect, useCallback } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { UserPreferences, HouseholdProfileType, ActivityType, TimeOfDay } from '../types/user';
import { AISafetyRecommendation } from '../types/ai';
import { fetchAISafetyRecommendations } from '../services/geminiClient';
import { ACTIVITIES, PROFILES, TIME_SLOTS } from '../constants';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  Activity,
  HeartHandshake,
  Info,
  Wind,
  Home,
} from 'lucide-react';

interface AISafetyPageProps {
  data: AirQualityCombinedData;
  preferences: UserPreferences;
}

export const AISafetyPage: React.FC<AISafetyPageProps> = ({ data, preferences }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(
    preferences.primaryActivities[0] || 'Morning Walk / Jog'
  );
  const [selectedProfile, setSelectedProfile] = useState<HouseholdProfileType>(
    preferences.householdProfile || 'General Adult'
  );
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay>('Morning');

  const [recommendation, setRecommendation] = useState<AISafetyRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAISafetyRecommendations(
        {
          aqi: data.current.aqi,
          pm2_5: data.current.pm2_5,
          pm10: data.current.pm10,
          temperature: data.weather.temperature,
          humidity: data.weather.humidity,
          windSpeed: data.weather.windSpeed,
          activity: selectedActivity,
          householdProfile: selectedProfile,
          timeOfDay: selectedTimeOfDay,
          cityName: data.location.name,
        },
        preferences.customGeminiApiKey
      );
      setRecommendation(res);
    } catch (err: unknown) {
      console.error('Failed to generate safety recommendations:', err);
      setError('Unable to complete AI evaluation. Please verify connection.');
    } finally {
      setIsLoading(false);
    }
  }, [
    data.current.aqi,
    data.current.pm2_5,
    data.current.pm10,
    data.weather.temperature,
    data.weather.humidity,
    data.weather.windSpeed,
    data.location.name,
    selectedActivity,
    selectedProfile,
    selectedTimeOfDay,
    preferences.customGeminiApiKey,
  ]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const getVerdictStyles = (verdict: AISafetyRecommendation['safetyVerdict']) => {
    switch (verdict) {
      case 'Safe':
        return {
          pill: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          badge: 'bg-emerald-500',
          border: 'border-emerald-200',
          bg: 'bg-emerald-50/50',
        };
      case 'Caution Required':
        return {
          pill: 'bg-amber-100 text-amber-800 border-amber-300',
          badge: 'bg-amber-500',
          border: 'border-amber-200',
          bg: 'bg-amber-50/50',
        };
      case 'Unsafe':
        return {
          pill: 'bg-orange-100 text-orange-800 border-orange-300',
          badge: 'bg-orange-500',
          border: 'border-orange-200',
          bg: 'bg-orange-50/50',
        };
      case 'Dangerous':
      default:
        return {
          pill: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
          badge: 'bg-rose-600',
          border: 'border-rose-200',
          bg: 'bg-rose-50/60',
        };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>Gemini Intelligence + Environmental Safety Model</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          AI Personal Health & Safety Assistant
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Contextual evaluation of atmospheric pollutants in {data.location.name} (AQI {data.current.aqi}) calibrated for your exact activity, time slot, and physiological profile.
        </p>
      </div>

      {/* Control Selector Panel */}
      <div className="dashboard-card p-6 border-slate-200/90 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Household Profile */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Household Profile
            </label>
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value as HouseholdProfileType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {PROFILES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              Planned Activity
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value as ActivityType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {ACTIVITIES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Time Window
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTimeOfDay(t)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    selectedTimeOfDay === t
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <span>Inputs: {data.location.name}</span>
            <span>•</span>
            <span>PM2.5: {data.current.pm2_5} µg/m³</span>
            <span>•</span>
            <span>Temp: {data.weather.temperature}°C</span>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center space-x-1.5 transition text-xs shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Consulting AI...' : 'Re-Evaluate Conditions'}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="dashboard-card p-8 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            Synthesizing Atmospheric Data & Health Impact...
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Correlating current PM2.5, NO2, and thermal inversion parameters with WHO physiological benchmarks.
          </p>
        </div>
      )}

      {/* Evaluation Results Card */}
      {!isLoading && recommendation && (
        <div className="space-y-6">
          {/* Main Verdict Header Card */}
          {(() => {
            const styles = getVerdictStyles(recommendation.safetyVerdict);
            return (
              <div className={`dashboard-card p-6 md:p-8 border ${styles.border} ${styles.bg}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${styles.pill}`}>
                        Safety Verdict: {recommendation.safetyVerdict}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Suitability Score: {recommendation.suitabilityScore} / 10
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2">
                      {recommendation.headline}
                    </h3>
                  </div>

                  {/* Visual Score Pill */}
                  <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-200 self-start md:self-auto">
                    <span className="text-xs font-bold text-slate-500">Outdoor Score:</span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {recommendation.suitabilityScore}/10
                    </span>
                  </div>
                </div>

                {/* Guidance Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Outdoor & Exercise Guidance */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                        <Wind className="w-4 h-4 text-emerald-600" />
                        <span>Outdoor Activity Guidance</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {recommendation.outdoorGuidance}
                      </p>
                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
                        <span className="font-bold text-slate-700 block">Why this matters:</span>
                        <p>{recommendation.outdoorExplanation}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                        <Activity className="w-4 h-4 text-sky-600" />
                        <span>Exercise & Workout Guidance</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {recommendation.exerciseGuidance}
                      </p>
                    </div>
                  </div>

                  {/* Mask & Ventilation Guidance */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          <span>Mask Guidance</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          recommendation.maskRecommendation.recommended ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {recommendation.maskRecommendation.maskType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {recommendation.maskRecommendation.details}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                          <Home className="w-4 h-4 text-indigo-600" />
                          <span>Ventilation & Fresh Air Window</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {recommendation.ventilationAdvice.recommendedWindow}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {recommendation.ventilationAdvice.details}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile-Specific Alert & Science */}
                <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-amber-700" />
                      Specific Advisory for {selectedProfile}:
                    </span>
                    <p className="text-amber-800 leading-relaxed">
                      {recommendation.vulnerableGroupAlert}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-slate-600" />
                      Atmospheric & Biological Science:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {recommendation.scientificExplanation}
                    </p>
                  </div>
                </div>

                {/* Indoor Care Tips List */}
                {recommendation.indoorCareTips && recommendation.indoorCareTips.length > 0 && (
                  <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Recommended Indoor Care Steps
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {recommendation.indoorCareTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Prominent Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> {recommendation.disclaimer} Always consult a licensed physician or pulmonologist for persistent symptoms like chronic cough, wheezing, or chest tightness during winter smog episodes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

