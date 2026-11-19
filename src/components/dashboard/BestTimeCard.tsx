import React from 'react';
import { HourlyForecastPoint } from '../../types/airQuality';
import { findBestOutdoorWindow } from '../../utils/outdoorWindow';
import { SunMedium, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface BestTimeCardProps {
  hourly: HourlyForecastPoint[];
  currentAqi: number;
  onNavigateToRoutine: () => void;
}

export const BestTimeCard: React.FC<BestTimeCardProps> = ({
  hourly,
  currentAqi,
  onNavigateToRoutine,
}) => {
  const windowResult = findBestOutdoorWindow(hourly, currentAqi);

  if (!windowResult.hasForecastData || !windowResult.bestWindow) {
    return null;
  }

  const { bestWindow, worstWindow } = windowResult;

  return (
    <div className="dashboard-card p-6 bg-gradient-to-br from-white via-white to-amber-50/20 border-amber-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <SunMedium className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              Best Time to Go Outside
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                Forecast Algorithm
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Optimal Outdoor Windows Based on Hourly Dispersion
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
        {/* Safest Recommended Window */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safest Window
            </span>
            <span className="text-xs font-extrabold text-emerald-900 font-mono px-2 py-0.5 rounded bg-emerald-200/60">
              AQI ~{bestWindow.avgAqi}
            </span>
          </div>

          <div className="text-lg font-extrabold text-slate-900">
            {bestWindow.startHour} – {bestWindow.endHour}
          </div>

          <p className="text-xs text-slate-600 leading-snug">
            {bestWindow.recommendation}
          </p>
        </div>

        {/* Worst Smog Spike Window */}
        {worstWindow && (
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Peak Smog Danger
              </span>
              <span className="text-xs font-extrabold text-rose-900 font-mono px-2 py-0.5 rounded bg-rose-200/60">
                Peak ~{worstWindow.peakAqi}
              </span>
            </div>

            <div className="text-lg font-extrabold text-slate-900">
              {worstWindow.startHour} – {worstWindow.endHour}
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              Avoid high-intensity workouts and prolonged transit. Cold thermal air inversion concentrates traffic soot near ground level.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Need a personalized 24h schedule?
        </span>
        <button
          onClick={onNavigateToRoutine}
          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition"
        >
          <span>Generate Routine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

