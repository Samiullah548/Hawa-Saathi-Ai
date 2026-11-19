import React, { useState } from 'react';
import {
  TRANSPORT_MODES,
  calculateCommuteEmissions,
  CommuteCalculationResult,
} from '../utils/emissionsCalculator';
import {
  Leaf,
  Car,
  Train,
  Bike,
  TreePine,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const GreenChoicesPage: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [tripsPerDay, setTripsPerDay] = useState<number>(2);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [passengers, setPassengers] = useState<number>(1);
  const [currentModeId, setCurrentModeId] = useState<string>('petrol_car');
  const [altModeId, setAltModeId] = useState<string>('metro_train');

  const result: CommuteCalculationResult = calculateCommuteEmissions(
    distanceKm,
    tripsPerDay,
    daysPerWeek,
    passengers,
    currentModeId,
    altModeId
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-lime-700 uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-lime-600" />
          <span>Active Climate & Clean Air Action</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Green Choices — Household Commute Comparison Tool
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Vehicular exhaust accounts for 28% to 40% of winter PM2.5 in Indian metro areas. Estimate your transit carbon emissions and see the real impact of switching to public or electric mobility.
        </p>
      </div>

      {/* Main Commute Calculator Card */}
      <div className="dashboard-card p-6 md:p-8 space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-2">
          <span>Configure Your Daily Commute</span>
        </h3>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>One-Way Distance</label>
              <span className="font-mono text-emerald-700">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 km</span>
              <span>30 km</span>
              <span>60 km</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>Trips Per Day</label>
              <span className="font-mono text-emerald-700">{tripsPerDay} trips</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={tripsPerDay}
              onChange={(e) => setTripsPerDay(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 (One-way)</span>
              <span>2 (Round-trip)</span>
              <span>6 trips</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>Days Per Week</label>
              <span className="font-mono text-emerald-700">{daysPerWeek} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 day</span>
              <span>5 days</span>
              <span>7 days</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <label>Passengers (Carpool)</label>
              <span className="font-mono text-emerald-700">{passengers} {passengers > 1 ? 'riders' : 'solo'}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 (Solo)</span>
              <span>3 carpool</span>
              <span>5 max</span>
            </div>
          </div>
        </div>

        {/* Transport Mode Comparison Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Current Transport Mode
            </label>
            <select
              value={currentModeId}
              onChange={(e) => setCurrentModeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {TRANSPORT_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.badge})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Compare Against Clean Alternative
            </label>
            <select
              value={altModeId}
              onChange={(e) => setAltModeId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-emerald-50/50 text-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {TRANSPORT_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.badge})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Annual Emissions */}
        <div className="dashboard-card p-5 border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Mode Emissions
          </span>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {result.currentAnnualKgCO2} <span className="text-xs font-medium text-slate-500">kg CO₂/yr</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {result.currentTripKgCO2} kg CO₂ per individual trip
          </p>
        </div>

        {/* Alternative Annual Emissions */}
        <div className="dashboard-card p-5 border-emerald-100 bg-emerald-50/30 space-y-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Alternative Mode Emissions
          </span>
          <div className="text-2xl font-extrabold text-emerald-900 tracking-tight">
            {result.alternativeAnnualKgCO2} <span className="text-xs font-medium text-emerald-700">kg CO₂/yr</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            {result.alternativeTripKgCO2} kg CO₂ per individual trip
          </p>
        </div>

        {/* Potential Saved Emissions */}
        <div className="dashboard-card p-5 border-teal-100 bg-teal-50/40 space-y-1">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            Estimated CO₂ Saved
          </span>
          <div className="text-2xl font-extrabold text-teal-900 tracking-tight">
            {result.annualSavingsKgCO2} <span className="text-xs font-medium text-teal-700">kg/yr</span>
          </div>
          <p className="text-[11px] text-teal-700 font-bold">
            {result.percentageReduction}% reduction in footprint
          </p>
        </div>

        {/* Equivalent Trees Absorbed */}
        <div className="dashboard-card p-5 border-lime-100 bg-lime-50/40 space-y-1">
          <span className="text-xs font-bold text-lime-800 uppercase tracking-wider flex items-center gap-1">
            <TreePine className="w-3.5 h-3.5 text-lime-700" />
            Tree Equivalence
          </span>
          <div className="text-2xl font-extrabold text-lime-950 tracking-tight">
            {result.treesEquivalentPerYear} <span className="text-xs font-medium text-lime-800">trees/yr</span>
          </div>
          <p className="text-[11px] text-lime-800">
            Equivalent annual carbon absorption
          </p>
        </div>
      </div>

      {/* Explanation & Impact Card */}
      <div className="dashboard-card p-6 md:p-8 bg-gradient-to-br from-white via-white to-emerald-50/20 border-emerald-100 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Scientific Impact & Methodology Breakdown</span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {result.explanation}
        </p>

        {/* Transparent Emission Factor Reference Table */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Transparent Emission Factor Assumptions (Indian Urban Baseline)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {TRANSPORT_MODES.slice(0, 8).map((m) => (
              <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="font-semibold text-slate-800 block truncate">{m.name}</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {m.emissionFactorGPerKm} g CO₂ / {m.isPerVehicle ? 'veh-km' : 'pax-km'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
            <strong>Transparency Notice:</strong> All calculations represent estimated tailpipe and grid equivalents based on average ARAI, TERI, and Indian Central Electricity Authority emission baselines. Real-world vehicle emissions vary with driving speeds, traffic congestion, and engine age.
          </div>
        </div>
      </div>

      {/* Sustainable Lifestyle Habits */}
      <div className="dashboard-card p-6 md:p-8 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
          Practical High-Impact Clean Habits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Cut Vehicle Idling:</span>
            <p className="leading-snug">
              Turn off vehicle engines at traffic signals with red lights exceeding 20 seconds. Idling wastes 1.2 liters of fuel/hour and concentrates toxic benzene at street level.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Switch to Metro & Local Trains:</span>
            <p className="leading-snug">
              Electric rail transit moves millions of commuters with up to 90% lower per-passenger greenhouse emissions compared to single-occupant private cars.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Zero Waste Burning:</span>
            <p className="leading-snug">
              Report roadside leaf and garbage burning immediately on local municipal apps (e.g. Sameer or 311). Open biomass burning releases black carbon and dioxins directly into ambient air.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
