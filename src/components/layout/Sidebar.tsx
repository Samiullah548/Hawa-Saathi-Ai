import React from 'react';
import {
  LayoutDashboard,
  Wind,
  Sparkles,
  ShieldCheck,
  CalendarClock,
  Home,
  Leaf,
  TrendingUp,
  MessageSquare,
  Settings,
  ChevronRight,
} from 'lucide-react';

export type NavPage =
  | 'dashboard'
  | 'live-aqi'
  | 'ai-safety'
  | 'family'
  | 'daily-routine'
  | 'indoor-care'
  | 'green-choices'
  | 'forecast'
  | 'ai-chat'
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  currentAqi?: number;
}

export const NAV_ITEMS = [
  { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-aqi' as NavPage, label: 'Live Air Quality', icon: Wind },
  { id: 'ai-safety' as NavPage, label: 'AI Safety Assistant', icon: Sparkles, badge: 'AI' },
  { id: 'family' as NavPage, label: 'Family Protection', icon: ShieldCheck },
  { id: 'daily-routine' as NavPage, label: 'Daily Routine Planner', icon: CalendarClock },
  { id: 'indoor-care' as NavPage, label: 'Indoor Air Care', icon: Home },
  { id: 'green-choices' as NavPage, label: 'Green Choices', icon: Leaf },
  { id: 'forecast' as NavPage, label: 'Forecast & Trends', icon: TrendingUp },
  { id: 'ai-chat' as NavPage, label: 'AI Chatbot', icon: MessageSquare, badge: 'AI' },
  { id: 'settings' as NavPage, label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentAqi,
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200/80 min-h-screen sticky top-0 h-screen select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              HawaSaathi <span className="text-emerald-600 font-bold">AI</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Urban Air Quality & Safety
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Features
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status & Info */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {currentAqi !== undefined && (
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Active City AQI</span>
              <span className="font-bold text-slate-900">{currentAqi}</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  currentAqi > 200
                    ? 'bg-rose-600'
                    : currentAqi > 100
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (currentAqi / 500) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="px-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>PromptWars Challenge 06</span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </span>
        </div>
      </div>
    </aside>
  );
};

