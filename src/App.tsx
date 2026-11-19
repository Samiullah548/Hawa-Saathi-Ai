import React, { useState, useEffect, useCallback } from 'react';
import { NavPage, Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { MobileNav } from './components/layout/MobileNav';
import { ShareCardModal } from './components/ui/ShareCardModal';
import { DashboardSkeleton } from './components/ui/Skeleton';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveAQIPage } from './pages/LiveAQIPage';
import { AISafetyPage } from './pages/AISafetyPage';
import { FamilyProtectionPage } from './pages/FamilyProtectionPage';
import { DailyRoutinePage } from './pages/DailyRoutinePage';
import { IndoorAirCarePage } from './pages/IndoorAirCarePage';
import { GreenChoicesPage } from './pages/GreenChoicesPage';
import { ForecastPage } from './pages/ForecastPage';
import { AIChatbotPage } from './pages/AIChatbotPage';
import { SettingsPage } from './pages/SettingsPage';

// Types & Services
import { AirQualityCombinedData, CityLocation } from './types/airQuality';
import { UserPreferences } from './types/user';
import {
  getSavedPreferences,
  savePreferences,
} from './services/storage';
import {
  fetchAirQualityAndWeather,
  POPULAR_INDIAN_CITIES,
} from './services/openMeteo';
import {
  sendLocalAQIAlert,
  requestNotificationPermission,
} from './services/notificationService';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getSavedPreferences());
  const [currentCity, setCurrentCity] = useState<CityLocation>(preferences.defaultCity || POPULAR_INDIAN_CITIES[0]);
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');

  const [aqData, setAqData] = useState<AirQualityCombinedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Load air quality and weather data
  const loadData = useCallback(async (city: CityLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAirQualityAndWeather(city);
      setAqData(data);

      // Trigger notification if enabled and AQI exceeds threshold
      if (
        preferences.notificationsEnabled &&
        data.current.aqi >= preferences.alertThreshold
      ) {
        sendLocalAQIAlert(
          `⚠️ High AQI Alert: ${city.name} (${data.current.aqi})`,
          `Air quality is ${data.current.aqiCategory}. Wear an N95 mask outside and seal bedroom windows.`
        );
      }
    } catch (err: unknown) {
      console.error('Failed to load air quality data:', err);
      setError('Live atmosphere data is temporarily unreachable. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, [preferences.notificationsEnabled, preferences.alertThreshold]);

  useEffect(() => {
    loadData(currentCity);
  }, [currentCity, loadData]);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
  };

  const handleToggleFavorite = (city: CityLocation) => {
    const isFav = preferences.favoriteCities.some(
      (c) => Math.abs(c.latitude - city.latitude) < 0.05 && Math.abs(c.longitude - city.longitude) < 0.05
    );
    const updatedFavs = isFav
      ? preferences.favoriteCities.filter(
          (c) => !(Math.abs(c.latitude - city.latitude) < 0.05 && Math.abs(c.longitude - city.longitude) < 0.05)
        )
      : [...preferences.favoriteCities, city];

    const updated = { ...preferences, favoriteCities: updatedFavs };
    setPreferences(updated);
    savePreferences(updated);
  };

  const handleToggleNotifications = async () => {
    if (!preferences.notificationsEnabled) {
      try {
        const perm = await requestNotificationPermission();
        if (perm === 'granted') {
          const updated = { ...preferences, notificationsEnabled: true };
          setPreferences(updated);
          savePreferences(updated);
          sendLocalAQIAlert(
            'HawaSaathi AQI Alerts Active',
            `You will now receive timely alerts when ${currentCity.name}'s air quality drops.`
          );
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const updated = { ...preferences, notificationsEnabled: false };
      setPreferences(updated);
      savePreferences(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      {/* Skip to Main Content Link for Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* Sidebar for Desktop */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        currentAqi={aqData?.current?.aqi}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          onRefresh={() => loadData(currentCity)}
          isLoading={isLoading}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          favoriteCities={preferences.favoriteCities}
          onToggleFavorite={handleToggleFavorite}
          notificationsEnabled={preferences.notificationsEnabled}
          onToggleNotifications={handleToggleNotifications}
        />

        <main id="main-content" className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full" tabIndex={-1}>
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs md:text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadData(currentCity)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading && !aqData ? (
            <DashboardSkeleton />
          ) : aqData ? (
            <>
              {currentPage === 'dashboard' && (
                <DashboardPage
                  data={aqData}
                  preferences={preferences}
                  onUpdatePreferences={setPreferences}
                  onNavigate={setCurrentPage}
                  onEnableNotifications={handleToggleNotifications}
                />
              )}

              {currentPage === 'live-aqi' && <LiveAQIPage data={aqData} />}

              {currentPage === 'ai-safety' && (
                <AISafetyPage data={aqData} preferences={preferences} />
              )}

              {currentPage === 'family' && <FamilyProtectionPage data={aqData} />}

              {currentPage === 'daily-routine' && (
                <DailyRoutinePage data={aqData} preferences={preferences} />
              )}

              {currentPage === 'indoor-care' && <IndoorAirCarePage data={aqData} />}

              {currentPage === 'green-choices' && <GreenChoicesPage />}

              {currentPage === 'forecast' && <ForecastPage data={aqData} />}

              {currentPage === 'ai-chat' && (
                <AIChatbotPage data={aqData} preferences={preferences} />
              )}

              {currentPage === 'settings' && (
                <SettingsPage
                  preferences={preferences}
                  onUpdatePreferences={setPreferences}
                  onSelectCity={handleSelectCity}
                />
              )}
            </>
          ) : null}
        </main>

        {/* Mobile Bottom & Drawer Nav */}
        <MobileNav
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          isOpenDrawer={isMobileDrawerOpen}
          onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* Community Awareness Shareable Card Modal */}
        {aqData && (
          <ShareCardModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            data={aqData}
          />
        )}
      </div>
    </div>
  );
};

export default App;
