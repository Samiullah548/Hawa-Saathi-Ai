import React, { useState } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { AQIGauge } from '../components/ui/AQIGauge';
import { StatCard } from '../components/ui/StatCard';
import { POLLUTANT_DEFINITIONS, getAQIExplanation, getAQIColor } from '../utils/aqiUtils';
import {
  Wind,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Eye,
  AlertCircle,
  Database,
} from 'lucide-react';

interface LiveAQIPageProps {
  data: AirQualityCombinedData;
}

export const LiveAQIPage: React.FC<LiveAQIPageProps> = ({ data }) => {
  const { current, weather, location } = data;
  const [expandedPollutant, setExpandedPollutant] = useState<string | null>('pm2_5');

  const explanation = getAQIExplanation(current.aqiCategory);
  const color = getAQIColor(current.aqiCategory);

  const pollutants = [
    { key: 'pm2_5', value: current.pm2_5, def: POLLUTANT_DEFINITIONS.pm2_5 },
    { key: 'pm10', value: current.pm10, def: POLLUTANT_DEFINITIONS.pm10 },
    { key: 'nitrogen_dioxide', value: current.nitrogen_dioxide, def: POLLUTANT_DEFINITIONS.nitrogen_dioxide },
    { key: 'sulphur_dioxide', value: current.sulphur_dioxide, def: POLLUTANT_DEFINITIONS.sulphur_dioxide },
    { key: 'carbon_monoxide', value: current.carbon_monoxide, def: POLLUTANT_DEFINITIONS.carbon_monoxide },
    { key: 'ozone', value: current.ozone, def: POLLUTANT_DEFINITIONS.ozone },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Atmosphere Diagnostic</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Real-Time Air Quality — {location.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {location.state ? `${location.state}, ` : ''}{location.country} • Coordinates: {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs text-xs text-slate-600">
          <Database className="w-4 h-4 text-emerald-600" />
          <div>
            <span className="font-semibold block text-slate-800">Source: Open-Meteo & Copernicus</span>
            <span className="text-[11px] text-slate-400">Refreshed: {data.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Gauge Card */}
        <div className="dashboard-card p-6 flex flex-col items-center justify-center text-center">
          <AQIGauge aqi={current.aqi} size={250} />
          <div className="mt-4 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Primary Driver
            </span>
            <div className="text-sm font-bold text-slate-800">
              {current.dominantPollutant}
            </div>
          </div>
        </div>

        {/* Health Risk & Status Card */}
        <div className="lg:col-span-2 dashboard-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Category Assessment
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${color.badge}`}>
                {current.aqiCategory}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {explanation.summary}
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {explanation.healthRisk}
            </p>
          </div>

          {/* Physiological Organ Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                <span>Respiratory</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {current.aqi > 150 ? 'Airway constriction, mucous hypersecretion & bronchospasms.' : 'Normal lung compliance with minimal bronchial irritation.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Cardiovascular</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {current.aqi > 150 ? 'Microscopic PM2.5 crosses into blood vessels, elevating arterial pressure.' : 'No significant cardiac stress detected from ambient air.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Eyes & Throat</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {current.aqi > 150 ? 'Burning conjunctiva, dry scratchy throat and sinus tightness.' : 'Clean sensation with no irritation to mucosal membranes.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Pollutant Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              All Measured Pollutants
            </h3>
            <p className="text-xs text-slate-400">
              Live readings compared against WHO 24-hour guidelines and Indian CPCB NAAQS standards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((p) => {
            const isExceededWho = p.value > p.def.whoStandard;
            const isExceededCpcb = p.value > p.def.cpcbStandard;
            return (
              <div
                key={p.key}
                className="dashboard-card p-5 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {p.def.chemicalFormula}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        isExceededCpcb
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isExceededWho
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isExceededCpcb ? 'Exceeds CPCB' : isExceededWho ? 'Exceeds WHO' : 'Safe'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800">{p.def.name}</h4>

                  <div className="mt-2 flex items-baseline space-x-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {p.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{p.def.unit}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>WHO Guideline:</span>
                    <span className="font-semibold text-slate-700">{p.def.whoStandard} {p.def.unit}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Indian CPCB Limit:</span>
                    <span className="font-semibold text-slate-700">{p.def.cpcbStandard} {p.def.unit}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                    {p.def.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Innovation Feature B: Pollution Impact Explainer */}
      <div className="dashboard-card p-6 border-teal-100 bg-gradient-to-br from-white via-white to-teal-50/20">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              Pollution Impact Explainer
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 uppercase">
                Educational Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Plain English Science Behind Urban Smog & Atmospheric Inversions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pollutants.map((p) => {
            const isExpanded = expandedPollutant === p.key;
            return (
              <div
                key={p.key}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedPollutant(isExpanded ? null : p.key)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {p.def.chemicalFormula}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {p.def.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Current: {p.value} {p.def.unit}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3 text-xs leading-relaxed text-slate-600 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                        <span className="font-bold text-slate-800 block">Biological Mechanism:</span>
                        <p>{p.def.healthEffects}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                        <span className="font-bold text-slate-800 block">Primary Urban Sources:</span>
                        <p>{p.def.sources}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

