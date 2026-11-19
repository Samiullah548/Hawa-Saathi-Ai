import React from 'react';
import { getAQICategory, getAQIColor } from '../../utils/aqiUtils';

interface AQIGaugeProps {
  aqi: number;
  size?: number;
  showCategory?: boolean;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  size = 240,
  showCategory = true,
}) => {
  const category = getAQICategory(aqi);
  const colorInfo = getAQIColor(category);

  // Normalize AQI to a 0-1 ratio for 0-500 range
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const ratio = clampedAqi / 500;

  // Arc calculation for semi-circle gauge (180 degrees)
  const radius = (size / 2) - 24;
  const strokeWidth = 18;
  const center = size / 2;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference * (1 - ratio);

  return (
    <div
      className="flex flex-col items-center justify-center relative"
      role="img"
      aria-label={`Air Quality Index gauge showing AQI ${aqi}, categorized as ${category}`}
    >
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg
          width={size}
          height={size * 0.65}
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="aqiArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="20%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="80%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={colorInfo.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#gaugeShadow)"
          />

          {/* Gradient preview track below */}
          <path
            d={`M ${center - radius} ${center + 12} A ${radius} ${radius} 0 0 1 ${center + radius} ${center + 12}`}
            fill="none"
            stroke="url(#aqiArcGradient)"
            strokeWidth="3"
            opacity="0.35"
            strokeLinecap="round"
          />
        </svg>

        {/* Center AQI Text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-3 text-center pointer-events-none"
          style={{ height: size * 0.65 }}
        >
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            US Air Quality Index
          </span>
          <div className="flex items-baseline space-x-1">
            <span
              className="text-4xl md:text-5xl font-extrabold tracking-tight transition-colors duration-300"
              style={{ color: colorInfo.hex }}
            >
              {aqi}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 500</span>
          </div>
        </div>
      </div>

      {showCategory && (
        <div className="mt-2 text-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-colors shadow-sm ${colorInfo.badge}`}
          >
            <span
              className="w-2 h-2 rounded-full mr-1.5 animate-pulse"
              style={{ backgroundColor: colorInfo.hex }}
            />
            {category}
          </span>
        </div>
      )}
    </div>
  );
};

