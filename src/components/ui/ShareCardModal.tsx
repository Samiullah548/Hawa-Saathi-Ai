import React, { useState } from 'react';
import { Modal } from './Modal';
import { AirQualityCombinedData } from '../../types/airQuality';
import { getAQIColor } from '../../utils/aqiUtils';
import { Copy, Check, Share2, Wind, ShieldAlert, Sparkles } from 'lucide-react';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AirQualityCombinedData;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const color = getAQIColor(data.current.aqiCategory);

  const shareText = `🌿 Air Quality Alert for ${data.location.name} (${data.location.state || data.location.country})
📊 US AQI: ${data.current.aqi} (${data.current.aqiCategory})
🔬 PM2.5: ${data.current.pm2_5} µg/m³ | PM10: ${data.current.pm10} µg/m³
🌡️ Temp: ${data.weather.temperature}°C | Humidity: ${data.weather.humidity}%
🛡️ Advisory: ${data.current.aqi > 150 ? 'Wear an N95 mask outside & avoid high-intensity workouts.' : 'Air conditions are acceptable for light outdoor tasks.'}
🕒 Recorded: ${data.lastUpdated} via ${data.current.sourceAttribution}
⚡ Powered by HawaSaathi AI – Urban Air Quality Assistant`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HawaSaathi AI - Air Quality in ${data.location.name}`,
          text: shareText,
        });
      } catch (e) {
        // user cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Air Quality Card" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* The Visual Social Card */}
        <div
          id="air-quality-share-card"
          className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br from-slate-900 via-navy-800 to-slate-900 border border-slate-700/50"
        >
          {/* Subtle background glow */}
          <div
            className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: color.hex }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                HawaSaathi AI
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              Community Alert
            </span>
          </div>

          {/* City & Live Status */}
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-tight text-white">
              {data.location.name}
            </h4>
            <p className="text-xs text-slate-400">
              {data.location.state ? `${data.location.state}, ` : ''}{data.location.country}
            </p>
          </div>

          {/* Big AQI Number & Pill */}
          <div className="my-5 flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Air Quality Index (US)
              </span>
              <div className="text-4xl font-extrabold text-white">
                {data.current.aqi}
              </div>
            </div>
            <div
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 shadow-sm"
              style={{
                backgroundColor: `${color.hex}25`,
                borderColor: color.hex,
                color: '#ffffff',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: color.hex }}
              />
              <span>{data.current.aqiCategory}</span>
            </div>
          </div>

          {/* Key Pollutant Stats */}
          <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-white/10 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">PM2.5</span>
              <span className="font-bold text-white">{data.current.pm2_5} µg/m³</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">PM10</span>
              <span className="font-bold text-white">{data.current.pm10} µg/m³</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Temp / Hum</span>
              <span className="font-bold text-white">{data.weather.temperature}°C • {data.weather.humidity}%</span>
            </div>
          </div>

          {/* Health Advisory Snippet */}
          <div className="mt-4 flex items-start space-x-2 text-xs text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">
              {data.current.aqi > 200
                ? 'High smog risk: Stay indoors, seal windows, and wear an N95 respirator if stepping out.'
                : data.current.aqi > 100
                ? 'Moderate pollution: Sensitive individuals and children should minimize outdoor workouts.'
                : 'Clean air conditions: Ideal for natural ventilation and outdoor physical activities.'}
            </p>
          </div>

          {/* Footer Timestamp & Source Attribution */}
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Updated: {data.lastUpdated}</span>
            <span>Data: {data.current.sourceAttribution.split(' ')[0]}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text Update</span>
              </>
            )}
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center space-x-1.5 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Share this with family, neighborhood groups, and friends to encourage timely N95 protection during peak smog.
        </p>
      </div>
    </Modal>
  );
};
