import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Server, 
  Sun, 
  CloudRain, 
  Wind, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  RefreshCw, 
  Gauge, 
  Zap, 
  Check, 
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Share2,
  Droplets,
  Eye,
  Activity,
  Heart,
  Calendar as CalendarIcon,
  ChevronRight,
  Filter,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CalendarPlus,
  Camera
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import WeatherMetricCard from '../components/weather/WeatherMetricCard';
import ForecastCard from '../components/weather/ForecastCard';
import RecommendationCard from '../components/weather/RecommendationCard';
import SearchPanel from '../components/weather/SearchPanel';
import HistoryDrawer from '../components/history/HistoryDrawer';
import FavoritesModal from '../components/favorites/FavoritesModal';
import AddToItineraryModal from '../components/itinerary/AddToItineraryModal';

import WeatherTrendChart from '../components/weather/WeatherTrendChart';

import weatherService from '../services/weatherService';
import recommendationService from '../services/recommendationService';
import healthService from '../services/healthService';
import { getDestinationMedia, fetchDestinationMedia } from '../services/destinationMediaService';
import { ALL_DESTINATIONS, DESTINATION_CATEGORIES } from '../components/common/DestinationAutocomplete';
import { useAuth } from '../context/AuthContext';
import { useTemperature } from '../context/TemperatureContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { unit, toDisplayTemp, unitSymbol } = useTemperature();
  const [searchParams] = useSearchParams();
  const urlCity = searchParams.get('city');

  // Search & Active Location State (Default: Manila, Philippines)
  const [cityName, setCityName] = useState(urlCity || 'Manila');
  const [requestedDate, setRequestedDate] = useState('Today');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  // Accurate Destination Landmark Media state
  const [destMedia, setDestMedia] = useState(() => getDestinationMedia(cityName));

  // Sync authentic Wikimedia landmark photo whenever destination changes
  const effectiveCity = weatherData?.location?.city || cityName;
  useEffect(() => {
    // 1. Immediately provide curated verified photo
    setDestMedia(getDestinationMedia(effectiveCity));

    // 2. Query live Wikipedia/Wikimedia API for fresh authentic landmark & telemetry
    let isCurrent = true;
    fetchDestinationMedia(effectiveCity).then((media) => {
      if (isCurrent && media) {
        setDestMedia(media);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [effectiveCity]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [recommendationFilter, setRecommendationFilter] = useState('ALL');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [activityToSchedule, setActivityToSchedule] = useState(null);
  const [showcaseCategory, setShowcaseCategory] = useState('POPULAR');

  const displayedShowcaseDestinations = ALL_DESTINATIONS.filter((dest) => {
    if (showcaseCategory === 'ALL') return true;
    if (showcaseCategory === 'POPULAR') return dest.popular;
    if (showcaseCategory === 'GLOBAL') return dest.categoryGroup === 'GLOBAL' || dest.country !== 'Philippines';
    if (showcaseCategory === 'PHILIPPINES') return dest.country === 'Philippines';
    return dest.categoryGroup === showcaseCategory;
  });

  // Health probe
  const [healthData, setHealthData] = useState(null);

  // Fetch full live weather, forecast, and recommendations for the given city
  const fetchCityData = async (city, date = 'Today') => {
    setIsLoading(true);
    setError(null);
    try {
      const [current, forecast, recs] = await Promise.all([
        weatherService.getCurrentWeather(city, date),
        weatherService.getForecast(city),
        recommendationService.getRecommendations(city, date),
      ]);

      setWeatherData(current);
      setForecastData(forecast?.dailyForecast || []);
      setRecommendations(recs?.recommendations || []);
      setCityName(current.location?.city || city);
      setRequestedDate(date);

      // Check if this city is currently favorited
      if (isAuthenticated) {
        try {
          const favs = await favoritesService.getFavorites();
          const validList = Array.isArray(favs) ? favs.filter((f) => f && f.city_name) : [];
          setFavoritesList(validList);
          const currentCity = (current.location?.city || city).toLowerCase();
          const matched = validList.some((f) => f.city_name && f.city_name.toLowerCase() === currentCity);
          setIsFavorited(matched);
        } catch (err) {
          // non-blocking
        }
      }
    } catch (err) {
      setError(err.message || `Failed to fetch weather telemetry for "${city}".`);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  // Load initial city on mount (prioritizing URL query param if present)
  useEffect(() => {
    const target = urlCity || cityName;
    fetchCityData(target, requestedDate);

    healthService.checkHealth().then((res) => {
      setHealthData(res.data);
    }).catch(() => {});
  }, [isAuthenticated, urlCity]);

  const handleSearch = async ({ location, date, scrollToActivities = true }) => {
    setIsSearching(true);
    await fetchCityData(location, date);
    if (scrollToActivities) {
      setTimeout(() => {
        const el = document.getElementById('recommendations-section');
        if (el) {
          const yOffset = -90; // account for fixed navbar
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please sign in or create an account to save favorite destinations.');
      return;
    }

    try {
      if (isFavorited) {
        const found = favoritesList.find(
          (f) => f && f.city_name && f.city_name.toLowerCase() === cityName.toLowerCase()
        );
        if (found) {
          await favoritesService.removeFavorite(found.id);
          setFavoritesList((prev) => prev.filter((f) => f.id !== found.id));
        }
        setIsFavorited(false);
      } else {
        const saved = await favoritesService.addFavorite(
          weatherData?.location?.city || cityName,
          weatherData?.location?.country || 'Global Region'
        );
        if (saved && saved.city_name) {
          setFavoritesList((prev) => [saved, ...prev.filter((p) => p && p.city_name)]);
        }
        setIsFavorited(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update favorite status.');
    }
  };

  const filteredRecommendations = recommendations.filter((rec) => {
    if (recommendationFilter === 'OUTDOOR') return rec.category === 'OUTDOOR' && rec.suitability !== 'CAUTION';
    if (recommendationFilter === 'CAUTION') return rec.suitability === 'CAUTION';
    if (recommendationFilter === 'INDOOR') return rec.category === 'INDOOR';
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. Primary Weather Search Command Bar */}
      <section>
        <SearchPanel
          onSearch={handleSearch}
          currentLocation={cityName}
          isLoading={isSearching || isLoading}
        />
      </section>

      {/* Error State Banner */}
      {error && (
        <Alert variant="error" title="Weather Telemetry Notice">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCityData(cityName, requestedDate)}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* 2. Active Location & Context Header */}
      {weatherData && (
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider shadow-specular-inset">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Doppler Telemetry
              </span>
              <span className="text-xs text-outline">
                Elevation: {weatherData.location?.elevation || '568m'} • {weatherData.location?.lat}, {weatherData.location?.lon}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-on-surface tracking-tight flex items-baseline gap-3 flex-wrap">
              <span>{weatherData.location?.city || cityName}</span>
              <span className="text-sm sm:text-base font-normal text-on-surface-variant font-body">
                {weatherData.location?.country || 'Global Forecast Region'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-tertiary" />
              <span>
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                • Window: {requestedDate}
              </span>
            </p>
          </div>

          {/* Favorite & Quick Drawer Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border shadow-specular-inset ${
                isFavorited
                  ? 'bg-tertiary/20 text-tertiary border-tertiary/30 hover:bg-tertiary/30'
                  : 'bg-surface-container-high/80 text-outline border-white/10 hover:text-on-surface'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorited ? 'fill-tertiary text-tertiary' : 'text-outline'}`} />
              <span>{isFavorited ? 'Saved Location' : 'Save Location'}</span>
            </button>

            {isAuthenticated && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Star}
                  onClick={() => setIsFavoritesOpen(true)}
                >
                  Saved Places ({favoritesList.length})
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Clock}
                  onClick={() => setIsHistoryOpen(true)}
                >
                  History
                </Button>
              </>
            )}
          </div>
        </section>
      )}

      {/* 3. Hero Atmospheric Snapshot + Telemetry Grid */}
      {/* 3. Hero Atmospheric Snapshot + Telemetry Grid */}
      {weatherData && (() => {
        const activeMedia = destMedia || getDestinationMedia(weatherData.location?.city || cityName);

        return (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Hero Weather Panel (7 cols) with Destination Landmark Photo */}
            <div className="lg:col-span-7 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl p-4 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-glass group">
              {/* Cinematic Destination Photo Background - Bright, authentic, and vibrant */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                  src={activeMedia.imageUrl}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.05] saturate-[1.1] transition-transform duration-1000 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
                  }}
                />
                {/* Multilayer gradient ensuring WCAG AAA contrast while letting scenic destination shine through */}
                <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/90 via-surface-container-lowest/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-black/25" />
              </div>

              {/* Specular Radial Gradients */}
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-tertiary/15 blur-3xl pointer-events-none" />
              <div className="absolute right-24 -bottom-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest font-display drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      Atmospheric Snapshot
                    </span>
                    <span className="text-outline text-xs hidden sm:inline">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary bg-surface-container-low/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-tertiary/30 shadow-md">
                      <Camera className="w-3 h-3 text-tertiary" /> {activeMedia.title}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                    <span className="font-display text-4xl sm:text-6xl font-extrabold text-on-surface tracking-tight font-tabular drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      {toDisplayTemp(weatherData.temperature?.current)}°
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-bold text-on-surface-variant drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {unit}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-on-surface/90 sm:ml-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      Feels like {toDisplayTemp(weatherData.temperature?.feelsLike)}{unitSymbol}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <p className="font-display font-semibold text-lg text-on-surface">
                      {weatherData.weather?.description
                        ? weatherData.weather.description.charAt(0).toUpperCase() + weatherData.weather.description.slice(1)
                        : weatherData.weather?.main || 'Clear Sky'}
                    </p>
                  </div>

                  {/* Destination Landmark Photo Preview Capsule */}
                  <div className="mt-4 flex items-center gap-3 p-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 max-w-md shadow-specular-inset">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                      <img
                        src={activeMedia.imageUrl}
                        alt={activeMedia.landmark}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
                        }}
                      />
                    </div>
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                          <MapPin className="w-3 h-3 text-primary" /> Famous Spot
                        </span>
                        <span className="font-bold text-xs text-on-surface truncate">
                          {activeMedia.landmark}
                        </span>
                      </div>
                      <p className="text-[11px] text-outline truncate mt-0.5">
                        {activeMedia.tag}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weather Graphic */}
                <div className="relative w-16 h-16 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_8px_24px_rgba(252,134,2,0.3)]" fill="none" viewBox="0 0 120 120">
                    <circle cx="68" cy="46" fill="url(#sun-grad)" r="26" />
                    <path
                      d="M30 78C30 68 38 60 48 60C51 60 53.8 60.8 56.2 62.2C59.6 53.6 68 47.5 78 47.5C90.7 47.5 101 57.8 101 70.5C101 71.3 100.9 72.1 100.8 72.9C104.4 75 107 79 107 83.5C107 90.4 101.4 96 94.5 96H38C33.6 96 30 92.4 30 88V78Z"
                      fill="url(#cloud-grad)"
                      fillOpacity="0.95"
                    />
                    <defs>
                      <linearGradient id="sun-grad" x1="42" y1="20" x2="94" y2="72" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fc8602" />
                        <stop offset="1" stopColor="#ffb781" />
                      </linearGradient>
                      <linearGradient id="cloud-grad" x1="30" y1="47.5" x2="107" y2="96" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#313852" />
                        <stop offset="1" stopColor="#171e37" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

            <div className="relative z-10 pt-6 mt-6 flex items-center justify-between border-t border-white/10 flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs font-tabular">
                <div className="flex items-center gap-1 font-semibold text-tertiary drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>High: {toDisplayTemp(weatherData.temperature?.tempMax)}{unitSymbol}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-primary drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Low: {toDisplayTemp(weatherData.temperature?.tempMin)}{unitSymbol}</span>
                </div>
                <div className="flex items-center gap-1 text-outline">
                  <Gauge className="w-3.5 h-3.5 text-secondary" />
                  <span>{weatherData.telemetry?.pressure} hPa</span>
                </div>
              </div>

              <Badge variant="primary" size="sm">
                Visibility: {weatherData.telemetry?.visibilityKm} km
              </Badge>
            </div>
          </div>

          {/* 6 Micro-Telemetry Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            <WeatherMetricCard
              title="Precipitation"
              value={weatherData.telemetry?.precipitationChance || 0}
              unit="%"
              description={weatherData.telemetry?.rain1h > 0 ? `${weatherData.telemetry.rain1h} mm/hr` : 'Minimal Risk'}
              icon={Droplets}
              progress={weatherData.telemetry?.precipitationChance || 0}
            />
            <WeatherMetricCard
              title="Wind & Gusts"
              value={weatherData.telemetry?.windSpeed || 0}
              unit="km/h"
              description={`Gusts up to ${weatherData.telemetry?.windGust || Math.round(weatherData.telemetry?.windSpeed * 1.3)} km/h`}
              icon={Wind}
            />
            <WeatherMetricCard
              title="UV Index"
              value={weatherData.telemetry?.uvIndex || 3.2}
              description="Moderate exposure index"
              icon={Sun}
              badgeText="Optimal"
              badgeVariant="optimal"
            />
            <WeatherMetricCard
              title="Humidity"
              value={weatherData.telemetry?.humidity || 50}
              unit="%"
              description="Relative atmospheric moisture"
              icon={Droplets}
              progress={weatherData.telemetry?.humidity || 50}
            />
            <WeatherMetricCard
              title="Air Quality"
              value={weatherData.telemetry?.aqi || 22}
              unit="AQI"
              description="Clean breathable index"
              icon={Sparkles}
              badgeText="Good"
              badgeVariant="optimal"
            />
            <WeatherMetricCard
              title="Pressure"
              value={weatherData.telemetry?.pressure || 1018}
              unit="hPa"
              description="Barometric atmospheric level"
              icon={Gauge}
            />
          </div>
        </section>
      );
    })()}

      {/* 4. Multi-Day Forecast Ribbon */}
      {forecastData.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight">
                Multi-Day Atmospheric Forecast
              </h2>
              <p className="text-xs sm:text-sm text-outline">
                Daily meteorological projections and temperature ranges.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary font-display hidden sm:inline-block">
              {forecastData.length} Day Outlook
            </span>
          </div>

          <div className="-mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x">
            {forecastData.map((f, idx) => {
              const iconMap = {
                Clear: Sun,
                Clouds: CloudSun,
                Rain: CloudRain,
                Wind: Wind,
              };
              const WeatherIcon = iconMap[f.condition] || CloudSun;

              return (
                <ForecastCard
                  key={f.date || idx}
                  day={f.day}
                  date={f.formattedDate || f.date}
                  condition={f.description || f.condition}
                  icon={WeatherIcon}
                  highTemp={toDisplayTemp(f.highTemp ?? f.high ?? 20)}
                  lowTemp={toDisplayTemp(f.lowTemp ?? f.low ?? 10)}
                  precipChance={f.precipChance ?? f.precip ?? 0}
                  isSelected={activeDayIndex === idx}
                  onClick={() => {
                    setActiveDayIndex(idx);
                    fetchCityData(cityName, f.date || f.day);
                  }}
                />
              );
            })}
          </div>

          {/* Interactive Chart.js Weather Trend */}
          <WeatherTrendChart forecastData={forecastData} />
        </section>
      )}

      {/* 5. Rule-Based Recommendations */}
      <section id="recommendations-section" className="space-y-4 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Tailored Activity Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-outline">
              Rule engine evaluation for <span className="text-primary font-bold">{cityName}</span> ({requestedDate}) based on live weather and profile tags.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              icon={CalendarPlus}
              onClick={() => {
                const itineraryUrl = `/itineraries?city=${encodeURIComponent(cityName)}&create=true`;
                if (!isAuthenticated) {
                  navigate(`/register?redirect=${encodeURIComponent(itineraryUrl)}`);
                  return;
                }
                navigate(itineraryUrl);
              }}
              className="shadow-glow whitespace-nowrap"
            >
              Plan Itinerary for {cityName}
            </Button>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-surface-container-low/80 p-1 rounded-full border border-white/10 overflow-x-auto max-w-full scrollbar-none">
            <button
              type="button"
              onClick={() => setRecommendationFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                recommendationFilter === 'ALL'
                  ? 'bg-primary-container text-on-primary-container shadow-glow'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              All ({recommendations.length})
            </button>
            <button
              type="button"
              onClick={() => setRecommendationFilter('OUTDOOR')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                recommendationFilter === 'OUTDOOR'
                  ? 'bg-optimal/20 text-optimal border border-optimal/30 shadow-glow-optimal'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Outdoor
            </button>
            <button
              type="button"
              onClick={() => setRecommendationFilter('CAUTION')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                recommendationFilter === 'CAUTION'
                  ? 'bg-caution/20 text-caution border border-caution/30 shadow-glow-amber'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Caution
            </button>
            <button
              type="button"
              onClick={() => setRecommendationFilter('INDOOR')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                recommendationFilter === 'INDOOR'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Indoor Alt
            </button>
          </div>
        </div>
      </div>

        {/* Recommendation Cards Grid */}
        {filteredRecommendations.length === 0 ? (
          <EmptyState
            title="No matching recommendations"
            description="No activities match the current weather conditions or category filter."
            icon={Compass}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecommendations.map((rec) => {
              const iconMap = {
                Compass: Compass,
                Droplets: Droplets,
                Activity: Activity,
                Sparkles: Sparkles,
                Wind: Wind,
              };
              const RecIcon = iconMap[rec.iconName] || Compass;

              return (
                <RecommendationCard
                  key={rec.id}
                  title={rec.title}
                  category={rec.category}
                  suitability={rec.suitability}
                  suitabilityScore={rec.suitabilityScore}
                  rationale={rec.rationale}
                  timeSlot={rec.timeSlot}
                  conditions={rec.conditions}
                  icon={RecIcon}
                  imageUrl={rec.imageUrl}
                  destination={rec.destination || cityName}
                  onAddToItinerary={() => {
                    if (!isAuthenticated) {
                      navigate(`/register?redirect=${encodeURIComponent(`/?city=${encodeURIComponent(cityName)}`)}`);
                      return;
                    }
                    setActivityToSchedule(rec);
                    setItineraryModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Saved Destinations Quick Selector */}
      {favoritesList.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight">
                Your Saved Locations
              </h2>
              <p className="text-xs sm:text-sm text-outline">
                Click any saved destination to quickly inspect real-time weather and activity suitability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoritesList.map((place) => (
              <div
                key={place.id}
                role="button"
                tabIndex={0}
                aria-label={`Inspect forecast for saved location ${place.city_name}`}
                onClick={() => fetchCityData(place.city_name, 'Today')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fetchCityData(place.city_name, 'Today');
                  }
                }}
                className="p-5 rounded-2xl bg-surface-container-low/70 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:bg-surface-container-high transition-all group flex flex-col justify-between shadow-specular-inset cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                      {place.city_name}
                    </h3>
                    <p className="text-xs text-outline font-medium">{place.country || 'Global Region'}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    Load Forecast <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <Badge variant="primary" size="sm">
                    Saved Place
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Discover Recommended Destinations Showcase */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight">
                Recommended Destinations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-outline mt-1">
              Explore worldwide and local travel destinations with Doppler meteorological telemetry and activity recommendations.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {DESTINATION_CATEGORIES.map((cat) => {
              const CatIcon = cat.icon || Compass;
              const isActive = showcaseCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setShowcaseCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-glow'
                      : 'bg-surface-container-high/60 text-outline hover:text-on-surface hover:bg-surface-container border border-white/5'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedShowcaseDestinations.slice(0, 8).map((dest) => {
            const IconComponent = dest.icon || MapPin;
            const media = getDestinationMedia(dest.shortName || dest.city);
            const isCurrentActive = cityName.toLowerCase().includes(dest.shortName.toLowerCase());

            return (
              <div
                key={dest.city}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${dest.city}, ${dest.province}`}
                onClick={() => {
                  handleSearch({ location: dest.city, date: requestedDate, scrollToActivities: false });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSearch({ location: dest.city, date: requestedDate, scrollToActivities: false });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl bg-surface-container-low/70 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between shadow-specular-inset cursor-pointer hover:-translate-y-0.5 hover:shadow-glass focus-visible:ring-2 focus-visible:ring-primary ${
                  isCurrentActive
                    ? 'border-primary ring-1 ring-primary/40'
                    : 'border-white/5 hover:border-primary/40'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-surface-container-high">
                  <img
                    src={media.imageUrl}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-black/20" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${dest.badgeColor || 'bg-black/40 text-white border-white/20'}`}>
                      {dest.tag}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Famous Spot Capsule */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate font-medium">{media.landmark}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                      {dest.city}
                    </h3>
                    <p className="text-[11px] text-outline font-medium truncate">
                      {dest.province}, {dest.country || dest.region}
                    </p>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1">
                      {dest.highlight}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-primary font-semibold flex items-center gap-1 text-[11px]">
                      Analyze Weather <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    {isCurrentActive ? (
                      <span className="text-[10px] font-bold text-optimal bg-optimal/10 px-2 py-0.5 rounded-full border border-optimal/20">
                        Active View
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Drawers and Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectCity={(city) => fetchCityData(city, 'Today')}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onSelectCity={(city) => fetchCityData(city, 'Today')}
      />

      <AddToItineraryModal
        isOpen={itineraryModalOpen}
        onClose={() => setItineraryModalOpen(false)}
        activity={activityToSchedule}
        destinationCity={weatherData?.location?.city || cityName}
        onSuccess={() => {}}
      />
    </div>
  );
}
