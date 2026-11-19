import React, { useState } from 'react';
import { AirQualityCombinedData } from '../types/airQuality';
import { ChecklistItem } from '../types/user';
import {
  getIndoorChecklist,
  saveIndoorChecklist,
} from '../services/storage';
import {
  Home,
  Wind,
  Flame,
  Sparkles,
  Flower2,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Fan,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface IndoorAirCarePageProps {
  data: AirQualityCombinedData;
}

export const IndoorAirCarePage: React.FC<IndoorAirCarePageProps> = ({ data }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => getIndoorChecklist());

  const aqi = data.current.aqi;
  const isHighSmog = aqi > 150;

  const toggleTask = (id: string) => {
    const updated = checklist.map((t) =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setChecklist(updated);
    saveIndoorChecklist(updated);
  };

  const completedCount = checklist.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Smart Ventilation Calculator
  const getVentilationAdvice = () => {
    if (aqi > 250) {
      return {
        status: 'Keep Windows Tightly Sealed',
        statusColor: 'text-rose-700 bg-rose-100 border-rose-300',
        timing: 'Do NOT open windows today',
        reason: 'Severe ambient particulate smog will rapidly infiltrate indoor spaces. Recirculate and filter indoor air mechanically.',
      };
    } else if (aqi > 130) {
      return {
        status: 'Restricted Micro-Ventilation Only',
        statusColor: 'text-amber-700 bg-amber-100 border-amber-300',
        timing: '1:00 PM – 3:00 PM (15-20 mins only)',
        reason: 'Ventilate briefly when solar warmth breaks the morning ground inversion layer, then immediately close windows and boost air purifier fan speed.',
      };
    } else {
      return {
        status: 'Safe for Natural Ventilation',
        statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        timing: 'Open opposing windows during daylight hours',
        reason: 'Outdoor air quality is acceptable. Cross-ventilation reduces indoor CO2, humidity, and volatile chemical buildup.',
      };
    }
  };

  const ventAdvice = getVentilationAdvice();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 uppercase tracking-wider">
          <Home className="w-4 h-4 text-sky-600" />
          <span>Indoor Sanctuary & Mitigation Engineering</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Indoor Air Care Assistant
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          We spend over 85% of our time indoors. Learn how to prevent outdoor smog infiltration, manage cooking soot, optimize air purifiers, and maintain clean breathing air.
        </p>
      </div>

      {/* Crucial Scientific Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Scientific Fact:</strong> Outdoor ambient AQI ({data.current.aqi} in {data.location.name}) does not directly measure your indoor air. Indoor PM2.5 depends on building infiltration, window seals, kitchen ventilation, and mechanical HEPA filtration. Without active air purifiers, indoor PM2.5 typically reaches 50% to 75% of outdoor levels within 2 hours.
        </p>
      </div>

      {/* Smart Ventilation Advisor Widget */}
      <div className="dashboard-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-sky-50/20 border-sky-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                Smart Window Ventilation Advisor
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated to {data.location.name}'s current AQI ({data.current.aqi}) & wind ({data.weather.windSpeed} km/h)
              </p>
            </div>
          </div>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${ventAdvice.statusColor}`}>
            {ventAdvice.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Recommended Window Slot:
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {ventAdvice.timing}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Why this timing:
            </span>
            <p className="text-xs text-slate-600 leading-snug">
              {ventAdvice.reason}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Deep-Dive Indoor Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Air Purifier & Filter Guide */}
        <div className="dashboard-card p-6 border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2.5 text-slate-900">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Fan className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm">
              Air Purifiers: CADR & HEPA Truths
            </h4>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Insist on True HEPA (H13 or H14):</strong> Only certified HEPA traps 99.97% of particles down to 0.3 microns. Avoid vague labels like "HEPA-type" or "HEPA-style".
            </p>
            <p>
              • <strong>CADR Formula:</strong> Your room area in sq. meters multiplied by 5 gives the minimum CADR (in m³/hr) needed to achieve 5 air changes per hour (ACH).
            </p>
            <p>
              • <strong>Filter Schedule:</strong> Vacuum the outer mesh pre-filter every 2-3 weeks. Replace the composite HEPA filter every 6-8 months in Indian winter smog conditions.
            </p>
          </div>
        </div>

        {/* Cooking & Indoor Smoke */}
        <div className="dashboard-card p-6 border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2.5 text-slate-900">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm">
              Cooking Pollution & Frying Soot
            </h4>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>The Tadka Spike:</strong> Deep frying and high-temperature oil heating produce massive indoor PM2.5 spikes often exceeding 350 µg/m³.
            </p>
            <p>
              • <strong>Kitchen Exhaust Chimney:</strong> Always switch the kitchen exhaust fan on 2 minutes before igniting the burner, and leave it running for 5 minutes after cooking.
            </p>
            <p>
              • <strong>Incense & Dhoop:</strong> Never burn incense sticks (agarbatti) in closed bedrooms during winter. Incense smoke contains volatile polycyclic hydrocarbons.
            </p>
          </div>
        </div>

        {/* Dust & Cleaning Techniques */}
        <div className="dashboard-card p-6 border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2.5 text-slate-900">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm">
              Dust Control: Wet Mopping vs Sweeping
            </h4>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Ban Dry Brooms:</strong> Traditional broom sweeping does not remove fine PM2.5; it re-suspends settled particles into breathing height for up to 4 hours.
            </p>
            <p>
              • <strong>Damp Microfiber Mops:</strong> Traps ultra-fine soot mechanically with zero re-suspension.
            </p>
            <p>
              • <strong>Vacuum Sealed Bags:</strong> Standard vacuum cleaners without HEPA exhaust blow micro-dust straight out the exhaust vent. Use only HEPA-sealed vacuum cleaners.
            </p>
          </div>
        </div>

        {/* Honest Guide on Indoor Plants */}
        <div className="dashboard-card p-6 border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2.5 text-slate-900">
            <div className="p-2 rounded-xl bg-lime-100 text-lime-800">
              <Flower2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm">
              Indoor Plants: The Honest Science
            </h4>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • <strong>The NASA Context:</strong> The 1989 NASA clean air study occurred in tiny, airtight sealed chambers over weeks with high plant densities, focusing on volatile chemical vapors (VOCs).
            </p>
            <p>
              • <strong>Real Home Limitations:</strong> In realistic rooms with human entry and door openings, you would need 10 to 100 plants per square meter to match one small air purifier.
            </p>
            <p>
              • <strong>Proper Role:</strong> Plants (Snake plant, Areca palm, ZZ plant) are great for psychological wellness, natural humidity, and daytime oxygen, but <strong>they do NOT replace HEPA filtration</strong> for PM2.5 smog.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Indoor Protection Checklist */}
      <div className="dashboard-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Personalized Indoor Protection Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Check off tasks as you fortify your home against winter smog
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">
              {completedCount} / {checklist.length} Completed
            </span>
            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleTask(item.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-start space-x-3.5 select-none ${
                item.isCompleted
                  ? 'bg-sky-50/60 border-sky-200 text-sky-950'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-sky-600 focus:outline-none"
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-sky-600 fill-sky-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-bold ${
                      item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
