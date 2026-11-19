import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  chemicalFormula?: string;
  value: number | string;
  unit: string;
  safeLimit?: number;
  safeLimitLabel?: string;
  statusText?: string;
  statusType?: 'good' | 'moderate' | 'warning' | 'danger';
  icon?: LucideIcon;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  chemicalFormula,
  value,
  unit,
  safeLimit,
  safeLimitLabel = 'WHO Safe Limit',
  statusText,
  statusType = 'good',
  icon: Icon,
  subtext,
}) => {
  const getStatusStyles = () => {
    switch (statusType) {
      case 'good':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-500',
        };
      case 'moderate':
        return {
          pill: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500',
        };
      case 'warning':
        return {
          pill: 'bg-orange-50 text-orange-700 border-orange-200',
          bar: 'bg-orange-500',
        };
      case 'danger':
      default:
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200',
          bar: 'bg-rose-600',
        };
    }
  };

  const styles = getStatusStyles();

  // Calculate percentage of safe limit for progress indicator
  let progressRatio = 0;
  if (typeof value === 'number' && safeLimit && safeLimit > 0) {
    progressRatio = Math.min(100, Math.round((value / (safeLimit * 3)) * 100));
  }

  return (
    <div className="dashboard-card p-5 flex flex-col justify-between hover:border-slate-300">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {Icon && (
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                {title}
                {chemicalFormula && (
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {chemicalFormula}
                  </span>
                )}
              </h4>
            </div>
          </div>
          {statusText && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${styles.pill}`}>
              {statusText}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline space-x-1.5">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        {safeLimit !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{safeLimitLabel}: {safeLimit} {unit}</span>
              {typeof value === 'number' && value > safeLimit && (
                <span className="font-semibold text-rose-600">
                  {Math.round((value / safeLimit) * 10) / 10}x limit
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
                style={{ width: `${Math.max(5, progressRatio)}%` }}
              />
            </div>
          </div>
        )}

        {subtext && !safeLimit && (
          <p className="text-xs text-slate-500">{subtext}</p>
        )}
      </div>
    </div>
  );
};
