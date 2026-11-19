import React from 'react';
import {
  LayoutDashboard,
  Wind,
  Sparkles,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import { NavPage, NAV_ITEMS } from './Sidebar';

interface MobileNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  isOpenDrawer,
  onCloseDrawer,
}) => {
  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 flex items-center justify-around shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        <button
          onClick={() => onNavigate('dashboard')}
          aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          aria-label="Navigate to Overview"
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            currentPage === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Overview</span>
        </button>

        <button
          onClick={() => onNavigate('live-aqi')}
          aria-current={currentPage === 'live-aqi' ? 'page' : undefined}
          aria-label="Navigate to Live AQI"
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            currentPage === 'live-aqi' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Wind className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Live AQI</span>
        </button>

        <button
          onClick={() => onNavigate('ai-safety')}
          aria-current={currentPage === 'ai-safety' ? 'page' : undefined}
          aria-label="Navigate to AI Safety"
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            currentPage === 'ai-safety' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">AI Safety</span>
        </button>

        <button
          onClick={() => onNavigate('ai-chat')}
          aria-current={currentPage === 'ai-chat' ? 'page' : undefined}
          aria-label="Navigate to Chatbot"
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition ${
            currentPage === 'ai-chat' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Chatbot</span>
        </button>

        <button
          onClick={onCloseDrawer}
          aria-label="Open Full Navigation Menu Drawer"
          className="flex flex-col items-center py-1.5 px-3 rounded-xl text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">All Menus</span>
        </button>
      </nav>

      {/* Mobile Drawer (When More / Hamburger is clicked) */}
      {isOpenDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">
                    HawaSaathi AI
                  </span>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseDrawer();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              PromptWars Challenge 06 • Urban Air Quality
            </div>
          </div>

          <div className="flex-1" onClick={onCloseDrawer} />
        </div>
      )}
    </>
  );
};

