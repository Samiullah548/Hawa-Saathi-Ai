import React, { useState } from 'react';
import {
  calculateSmogSurvivalScore,
  SmogProtectionActions,
} from '../../utils/smogScore';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface SmogScoreCardProps {
  aqi: number;
  actions: SmogProtectionActions;
  onUpdateActions: (actions: SmogProtectionActions) => void;
}

export const SmogScoreCard: React.FC<SmogScoreCardProps> = ({
  aqi,
  actions,
  onUpdateActions,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const result = calculateSmogSurvivalScore(aqi, actions);

  const toggleAction = (key: keyof SmogProtectionActions) => {
    onUpdateActions({
      ...actions,
      [key]: !actions[key],
    });
  };

  return (
    <div className="dashboard-card p-6 border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              Smog Survival Score
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Innovation
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Personal Resilience vs Ambient Air Quality
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${result.badgeBg} ${result.tierColor}`}
        >
          {result.tier}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-between py-2 border-y border-slate-100">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {result.score}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {result.verdict}
          </p>
        </div>

        {/* Progress Circular/Bar Visual */}
        <div className="w-24 h-24 relative flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 transition-all duration-700 ease-out"
              strokeDasharray={`${result.score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-700">{result.score}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Shield</span>
          </div>
        </div>
      </div>

      {/* Quick Action Checklist Toggles */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
          <span>Your Active Protection Habits</span>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{showBreakdown ? 'Hide Math' : 'How It Works'}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => toggleAction('hasAirPurifier')}
            className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
              actions.hasAirPurifier
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  actions.hasAirPurifier ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
              <span>HEPA Purifier Active</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700">+15 pts</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAction('hasN95Masks')}
            className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
              actions.hasN95Masks
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  actions.hasN95Masks ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
              <span>N95 Masks Ready</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700">+12 pts</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAction('keepsWindowsClosedAtPeak')}
            className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
              actions.keepsWindowsClosedAtPeak
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  actions.keepsWindowsClosedAtPeak ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
              <span>Peak Windows Sealed</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700">+10 pts</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAction('usesExhaustWhileCooking')}
            className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
              actions.usesExhaustWhileCooking
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  actions.usesExhaustWhileCooking ? 'text-emerald-600' : 'text-slate-300'
                }`}
              />
              <span>Kitchen Chimney / Exhaust</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700">+8 pts</span>
          </button>
        </div>
      </div>

      {/* Explanatory Calculation Breakdown */}
      {showBreakdown && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3 animate-fadeIn text-xs text-slate-600">
          <div className="bg-slate-50 p-3 rounded-xl space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Ambient Air Baseline:</span>
              <span>{result.environmentPoints} / 40 pts</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Calculated dynamically from current US AQI ({aqi}). Even in hazardous air, active household mitigation can boost resilience by up to +60 points.
            </p>
            <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-200">
              <span>Household Protection Actions:</span>
              <span>{result.actionPoints} / 60 pts</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {result.breakdown.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[11px]">
                <span className={item.status === 'active' ? 'text-emerald-800 font-medium' : 'text-slate-400'}>
                  • {item.name}
                </span>
                <span className="font-mono font-semibold">
                  {item.pointsEarned} / {item.maxPoints} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

