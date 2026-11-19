import React from 'react';
import { AirQualityCombinedData } from '../../types/airQuality';
import { AQIGauge } from '../ui/AQIGauge';
import { getAQIExplanation, getAQIColor } from '../../utils/aqiUtils';
import { ShieldAlert, Wind, Clock, Info } from 'lucide-react';

interface HeroAQICardProps {
  data: AirQualityCombinedData;
  onNavigateToLive: () => void;
  onNavigateToSafety: () => void;
}

export const HeroAQICard: React.FC<HeroAQICardProps> = ({
  data,
  onNavigateToLive,
  onNavigateToSafety,
}) => {
  const { current, location, weather } = data;
  const explanation = getAQIExplanation(current.aqiCategory);
  const color = getAQIColor(current.aqiCategory);

  return (
    <div className="dashboard-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-slate-50/50 relative overflow-hidden">
      {/* Subtle background ambient blob */}
      <div
        className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: color.hex }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Gauge + Visual Representation */}
        <div className="flex flex-col items-center flex-shrink-0 w-full lg:w-auto">
          <AQIGauge aqi={current.aqi} size={250} />
          <div className="mt-2 text-center">
            <span className="text-xs font-semibold text-slate-400">
              Dominant Pollutant:
            </span>
            <span className="ml-1.5 text-xs font-bold text-slate-700">
              {current.dominantPollutant}
            </span>
          </div>
        </div>

        {/* Right: Detailed Context & Health Impact */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Air Quality Status
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {current.aqiCategory}
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated: {data.lastUpdated}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {explanation.summary}
          </p>

          {/* Quick Health Verdict Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">
                  Health Risk Indicator
                </span>
                <span className="text-xs text-slate-500 leading-snug">
                  {explanation.healthRisk}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-2.5">
              <Wind className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-700 block">
                  Outdoor Activity Advice
                </span>
                <span className="text-xs text-slate-500 leading-snug">
                  {explanation.outdoorAdvice}
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTAs & Attribution */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span className="truncate max-w-xs">{current.sourceAttribution}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onNavigateToLive}
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 transition"
              >
                Inspect All Pollutants
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={onNavigateToSafety}
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 transition"
              >
                AI Safety Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

