import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Crosshair,
  RefreshCw,
  Share2,
  Bell,
  Menu,
  Star,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { CityLocation } from '../../types/airQuality';
import {
  POPULAR_INDIAN_CITIES,
  searchCitiesGeocoding,
} from '../../services/openMeteo';

interface TopNavProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenShareModal: () => void;
  onOpenMobileMenu: () => void;
  favoriteCities: CityLocation[];
  onToggleFavorite: (city: CityLocation) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentCity,
  onSelectCity,
  onRefresh,
  isLoading,
  onOpenShareModal,
  onOpenMobileMenu,
  favoriteCities,
  onToggleFavorite,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(POPULAR_INDIAN_CITIES.slice(0, 8));
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCitiesGeocoding(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Error during city search:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const userLoc: CityLocation = {
          name: 'Current Location',
          state: 'GPS Detected',
          country: 'India',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        onSelectCity(userLoc);
        setIsOpen(false);
      },
      (err) => {
        setGeoLocating(false);
        setGeoError(err.message || 'Location permission denied.');
        setTimeout(() => setGeoError(null), 4000);
      },
      { timeout: 10000 }
    );
  };

  const isCurrentFavorite = favoriteCities.some(
    (c) =>
      Math.abs(c.latitude - currentCity.latitude) < 0.05 &&
      Math.abs(c.longitude - currentCity.longitude) < 0.05
  );

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu trigger + City indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm md:text-base text-slate-800">
                  {currentCity.name}
                </span>
                <button
                  onClick={() => onToggleFavorite(currentCity)}
                  title={isCurrentFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  className={`p-1 rounded-md transition ${
                    isCurrentFavorite
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-300 hover:text-slate-500'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              <span className="text-xs text-slate-400 block -mt-0.5">
                {currentCity.state ? `${currentCity.state}, ` : ''}{currentCity.country}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Indian Cities Bar */}
        <div ref={dropdownRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search Indian cities (Delhi, Meerut, Mumbai...)"
              className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-2xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            {isSearching && (
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn max-h-80 overflow-y-auto">
              {/* Geolocation Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={geoLocating}
                className="w-full px-4 py-3 flex items-center space-x-3 text-left text-sm font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 border-b border-emerald-100 transition"
              >
                <Crosshair className={`w-4 h-4 ${geoLocating ? 'animate-spin' : ''}`} />
                <span>
                  {geoLocating ? 'Detecting coordinates...' : 'Use My Current Location (GPS)'}
                </span>
              </button>

              {geoError && (
                <div className="px-4 py-2 text-xs text-rose-600 bg-rose-50 flex items-center space-x-1.5 border-b border-rose-100">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{geoError}</span>
                </div>
              )}

              {/* Saved Favorite Quick List */}
              {favoriteCities.length > 0 && searchQuery.trim().length === 0 && (
                <div className="px-4 pt-2.5 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Saved Favorite Cities
                </div>
              )}
              {searchQuery.trim().length === 0 &&
                favoriteCities.map((fav) => (
                  <button
                    key={`${fav.name}-${fav.latitude}`}
                    type="button"
                    onClick={() => {
                      onSelectCity(fav);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-slate-50 transition text-sm text-slate-700"
                  >
                    <div className="flex items-center space-x-2">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="font-medium">{fav.name}</span>
                      {fav.state && (
                        <span className="text-xs text-slate-400">({fav.state})</span>
                      )}
                    </div>
                    {currentCity.name === fav.name && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}

              {/* Search Results / Popular Cities */}
              <div className="px-4 pt-2.5 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery.trim().length > 0 ? 'Search Results' : 'Popular Indian Cities'}
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No cities found matching "{searchQuery}".
                </div>
              ) : (
                searchResults.map((city) => (
                  <button
                    key={`${city.name}-${city.latitude}-${city.longitude}`}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition text-sm text-slate-700"
                  >
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <span className="font-medium text-slate-800">{city.name}</span>
                        {city.state && (
                          <span className="text-xs text-slate-400 ml-1.5">
                            {city.state}, {city.country}
                          </span>
                        )}
                      </div>
                    </div>
                    {currentCity.name === city.name && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Air Quality Data"
            className="p-2 md:px-3 md:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          {/* Share Awareness Card */}
          <button
            onClick={onOpenShareModal}
            title="Share Awareness Card"
            className="p-2 md:px-3 md:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 transition border border-emerald-200"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Share Card</span>
          </button>

          {/* Notifications bell */}
          <button
            onClick={onToggleNotifications}
            title={notificationsEnabled ? 'AQI Alerts Enabled' : 'Enable AQI Alerts'}
            className={`p-2 rounded-xl transition ${
              notificationsEnabled
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

