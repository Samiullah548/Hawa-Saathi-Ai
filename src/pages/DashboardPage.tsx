import React from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { UserPreferences } from '../types/user';
import { NavPage } from '../components/layout/Sidebar';
import { HeroAQICard } from '../components/dashboard/HeroAQICard';
import { SmogScoreCard } from '../components/dashboard/SmogScoreCard';
import { BestTimeCard } from '../components/dashboard/BestTimeCard';
import { QuickForecast } from '../components/dashboard/QuickForecast';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AlertBanner } from '../components/ui/AlertBanner';
import { StatCard } from '../components/ui/StatCard';
import { POLLUTANT_DEFINITIONS } from '../utils/aqiUtils';
import {
  Thermometer,
  Droplets,
  Wind as WindIcon,
  CloudFog,
  Activity,
  Shield,
  Layers,
} from 'lucide-react';

interface DashboardPageProps {
  data: AirQualityCombinedData;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onNavigate: (page: NavPage) => void;
  onEnableNotifications: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  data,
  preferences,
  onUpdatePreferences,
  onNavigate,
  onEnableNotifications,
}) => {
  const { current, weather, hourly, location } = data;

  const handleUpdateSmogActions = (newActions: UserPreferences['smogActionsState']) => {
    onUpdatePreferences({
      ...preferences,
      smogActionsState: newActions,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* High Smog Alert Banner */}
      <AlertBanner
        cityName={location.name}
        aqi={current.aqi}
        category={current.aqiCategory}
        onNavigateToSafety={() => onNavigate('ai-safety')}
        onEnableNotifications={onEnableNotifications}
      />

      {/* Main Hero Card with AQI Gauge */}
      <HeroAQICard
        data={data}
        onNavigateToLive={() => onNavigate('live-aqi')}
        onNavigateToSafety={() => onNavigate('ai-safety')}
      />

      {/* Differentiating Innovation Features Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmogScoreCard
          aqi={current.aqi}
          actions={preferences.smogActionsState}
          onUpdateActions={handleUpdateSmogActions}
        />
        <BestTimeCard
          hourly={hourly}
          currentAqi={current.aqi}
          onNavigateToRoutine={() => onNavigate('daily-routine')}
        />
      </div>

      {/* Key Pollutants & Weather Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Live Environmental Metrics
            </h3>
          </div>
          <button
            onClick={() => onNavigate('live-aqi')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            Detailed Breakdown →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Fine Particulate"
            chemicalFormula="PM2.5"
            value={current.pm2_5}
            unit="µg/m³"
            safeLimit={POLLUTANT_DEFINITIONS.pm2_5.whoStandard}
            statusText={current.pm2_5 > 60 ? 'Hazardous' : current.pm2_5 > 15 ? 'Elevated' : 'Safe'}
            statusType={current.pm2_5 > 60 ? 'danger' : current.pm2_5 > 15 ? 'warning' : 'good'}
            icon={CloudFog}
          />

          <StatCard
            title="Coarse Dust"
            chemicalFormula="PM10"
            value={current.pm10}
            unit="µg/m³"
            safeLimit={POLLUTANT_DEFINITIONS.pm10.whoStandard}
            statusText={current.pm10 > 100 ? 'High' : current.pm10 > 45 ? 'Moderate' : 'Safe'}
            statusType={current.pm10 > 100 ? 'danger' : current.pm10 > 45 ? 'moderate' : 'good'}
            icon={WindIcon}
          />

          <StatCard
            title="Nitrogen Dioxide"
            chemicalFormula="NO₂"
            value={current.nitrogen_dioxide}
            unit="µg/m³"
            safeLimit={POLLUTANT_DEFINITIONS.nitrogen_dioxide.whoStandard}
            statusText={current.nitrogen_dioxide > 80 ? 'High' : 'Normal'}
            statusType={current.nitrogen_dioxide > 80 ? 'danger' : 'good'}
            icon={Activity}
          />

          <StatCard
            title="Temperature"
            value={weather.temperature}
            unit="°C"
            subtext={`Feels like ${weather.apparentTemperature ?? weather.temperature}°C`}
            icon={Thermometer}
          />

          <StatCard
            title="Humidity"
            value={weather.humidity}
            unit="%"
            subtext={weather.humidity > 70 ? 'Moist / Smog Trap' : 'Dry / Clear'}
            icon={Droplets}
          />

          <StatCard
            title="Wind Speed"
            value={weather.windSpeed}
            unit="km/h"
            subtext={weather.windSpeed < 5 ? 'Stagnant Calm Air' : 'Dispersive Breeze'}
            icon={WindIcon}
          />
        </div>
      </div>

      {/* 24-Hour Quick Outlook */}
      <QuickForecast
        hourly={hourly}
        onNavigateToForecast={() => onNavigate('forecast')}
      />

      {/* Quick Action Shortcuts */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 mb-3 px-1">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Protection & Sustainability Tools
          </h3>
        </div>
        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
};
