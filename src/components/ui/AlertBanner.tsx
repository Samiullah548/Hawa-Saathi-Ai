import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, ChevronRight, Bell } from 'lucide-react';
import { AQICategory } from '../../types/airQuality';
import { getAQIColor } from '../../utils/aqiUtils';

interface AlertBannerProps {
  cityName: string;
  aqi: number;
  category: AQICategory;
  onNavigateToSafety?: () => void;
  onEnableNotifications?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  cityName,
  aqi,
  category,
  onNavigateToSafety,
  onEnableNotifications,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Only display banner if air is Unhealthy, Very Unhealthy, or Hazardous (AQI > 150)
  if (dismissed || aqi <= 150) {
    return null;
  }

  const isHazardous = aqi > 300;
  const isVeryUnhealthy = aqi > 200 && aqi <= 300;
  const color = getAQIColor(category);

  return (
    <div
      role="alert"
      className={`relative mb-6 rounded-2xl p-4 md:p-5 border shadow-sm transition-all animate-fadeIn ${
        isHazardous
          ? 'bg-rose-950 text-white border-rose-800'
          : isVeryUnhealthy
          ? 'bg-purple-900 text-white border-purple-800'
          : 'bg-amber-50 text-amber-950 border-amber-300'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 ${
              isHazardous || isVeryUnhealthy ? 'bg-white/10 text-white' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isHazardous ? (
              <ShieldAlert className="w-5 h-5 text-rose-300 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20">
                Pollution Warning
              </span>
              <span className="text-xs font-semibold">
                {cityName} • US AQI {aqi} ({category})
              </span>
            </div>
            <p className="mt-1 text-sm font-medium opacity-90 leading-relaxed">
              {isHazardous
                ? 'Severe winter inversion smog emergency. High PM2.5 levels penetrate deep into lung airways. Wear an N95 mask outside and run indoor HEPA filters.'
                : 'Elevated particulate pollution detected. Sensitive individuals, children, and elderly should avoid prolonged outdoor exertion.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto flex-shrink-0">
          {onNavigateToSafety && (
            <button
              onClick={onNavigateToSafety}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1 shadow-sm ${
                isHazardous || isVeryUnhealthy
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <span>View Safety Protocol</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onEnableNotifications && (
            <button
              onClick={onEnableNotifications}
              title="Enable AQI Alerts"
              className={`p-2 rounded-xl border transition ${
                isHazardous || isVeryUnhealthy
                  ? 'border-white/20 hover:bg-white/10 text-white'
                  : 'border-amber-300 hover:bg-amber-100 text-amber-800'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className={`p-1.5 rounded-lg opacity-70 hover:opacity-100 transition ${
              isHazardous || isVeryUnhealthy ? 'hover:bg-white/10' : 'hover:bg-amber-200/50'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

