import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HourlyForecastPoint } from '../../types/airQuality';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getAQIColor } from '../../utils/aqiUtils';

interface QuickForecastProps {
  hourly: HourlyForecastPoint[];
  onNavigateToForecast: () => void;
}

export const QuickForecast: React.FC<QuickForecastProps> = ({
  hourly,
  onNavigateToForecast,
}) => {
  // Use first 16 hours for a crisp dashboard preview
  const data = hourly.slice(0, 16);

  interface QuickTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: HourlyForecastPoint }>;
  }

  const CustomTooltip: React.FC<QuickTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload as HourlyForecastPoint;
      const color = getAQIColor(pt.category);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
          <div className="font-bold flex items-center justify-between gap-3">
            <span>{pt.time}</span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold"
              style={{ backgroundColor: color.hex }}
            >
              {pt.category}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>AQI:</span>
            <span className="font-bold text-white">{pt.aqi}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>PM2.5:</span>
            <span className="font-bold text-white">{pt.pm2_5} µg/m³</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-300">
            <span>Temp / Hum:</span>
            <span className="font-bold text-white">{pt.temperature}°C • {pt.humidity}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              24-Hour Air Quality Outlook
            </h3>
            <p className="text-xs text-slate-400">
              Hourly US AQI Trend & Smog Dispersion
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToForecast}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition"
        >
          <span>Full Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="hourlyAqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#hourlyAqiGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

