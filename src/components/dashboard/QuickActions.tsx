import React from 'react';
import { NavPage } from '../layout/Sidebar';
import { Sparkles, ShieldCheck, Home, Leaf, ChevronRight } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: NavPage) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      page: 'ai-safety' as NavPage,
      title: 'AI Safety Assistant',
      desc: 'Get tailored activity, mask & ventilation advice from Gemini',
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 hover:border-emerald-300',
      badge: 'AI Powered',
    },
    {
      page: 'family' as NavPage,
      title: 'Family Protection Planner',
      desc: 'Protect children, elderly, and sensitive family members',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-700 hover:border-teal-300',
    },
    {
      page: 'indoor-care' as NavPage,
      title: 'Indoor Air Care',
      desc: 'Ventilation windows, HEPA purifiers & checklist tracker',
      icon: Home,
      color: 'bg-sky-50 text-sky-700 hover:border-sky-300',
    },
    {
      page: 'green-choices' as NavPage,
      title: 'Green Commute Calculator',
      desc: 'Compare transit emissions & calculate your CO2 savings',
      icon: Leaf,
      color: 'bg-lime-50 text-lime-800 hover:border-lime-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.page}
            onClick={() => onNavigate(act.page)}
            className={`dashboard-card p-5 text-left flex flex-col justify-between group transition duration-200 border border-slate-200/80 ${act.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-2xl bg-white shadow-xs text-slate-800">
                  <Icon className="w-5 h-5 text-current" />
                </div>
                {act.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                    {act.badge}
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                {act.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {act.desc}
              </p>
            </div>

            <div className="mt-4 pt-2 flex items-center text-xs font-bold text-slate-700 group-hover:text-emerald-700">
              <span>Open Tool</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

