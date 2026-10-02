import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Server, 
  Database, 
  Layers, 
  Terminal, 
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
  Flame,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import WeatherMetricCard from '../components/weather/WeatherMetricCard';
import ForecastCard from '../components/weather/ForecastCard';
import RecommendationCard from '../components/weather/RecommendationCard';
import SearchPanel from '../components/weather/SearchPanel';
import healthService from '../services/healthService';

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Search & Active Location State
  const [locationName, setLocationName] = useState('Interlaken, Switzerland');
  const [regionInfo, setRegionInfo] = useState('Canton of Bern • 568m elev.');
  const [isFavorited, setIsFavorited] = useState(true);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [recommendationFilter, setRecommendationFilter] = useState('ALL');
  const [isSearching, setIsSearching] = useState(false);

  // Health probe
  const fetchHealth = async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const response = await healthService.checkHealth();
      setHealthData(response.data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setHealthError(err.message || 'Failed to connect to backend.');
      setHealthData(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSearch = ({ location, date }) => {
    setIsSearching(true);
    setTimeout(() => {
      setLocationName(location.includes(',') ? location : `${location}, Regional Forecast`);
      setIsSearching(false);
    }, 400);
  };

  // 7-Day Forecast Data
  const forecastDays = [
    { day: 'Today', date: 'Oct 14', condition: 'Partly Sunny', high: 21, low: 11, precip: 12, icon: Sun },
    { day: 'Sun', date: 'Oct 15', condition: 'Sunny & Clear', high: 23, low: 12, precip: 0, icon: Sun },
    { day: 'Mon', date: 'Oct 16', condition: 'Scattered Clouds', high: 20, low: 10, precip: 15, icon: CloudSun },
    { day: 'Tue', date: 'Oct 17', condition: 'Alpine Showers', high: 16, low: 8, precip: 65, icon: CloudRain },
    { day: 'Wed', date: 'Oct 18', condition: 'Breezy & Cool', high: 17, low: 7, precip: 20, icon: Wind },
    { day: 'Thu', date: 'Oct 19', condition: 'Optimal Sun', high: 22, low: 11, precip: 5, icon: Sun },
    { day: 'Fri', date: 'Oct 20', condition: 'Crisp Morning', high: 19, low: 9, precip: 10, icon: CloudSun },
  ];

  // Recommendations Data
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Harder Kulm Panoramic Hiking Trail',
      category: 'OUTDOOR',
      suitability: 'OPTIMAL',
      suitabilityScore: 96,
      rationale: 'Crisp 19°C alpine air, mild 14 km/h breeze, and high visibility (25km) offer perfect ascent conditions.',
      timeSlot: '08:30 - 13:30',
      conditions: ['Dry Trails', 'UV Moderate (3)', 'Gusts < 20 km/h'],
      icon: Compass,
    },
    {
      id: 'rec-2',
      title: 'Lake Brienz & Thun Kayaking',
      category: 'OUTDOOR',
      suitability: 'OPTIMAL',
      suitabilityScore: 92,
      rationale: 'Glass-smooth lake water with gentle surface winds. Zero precipitation risk before late afternoon.',
      timeSlot: '09:00 - 12:00',
      conditions: ['Water Temp 15°C', 'Precip 0%', 'Wind 8 km/h NW'],
      icon: Droplets,
    },
    {
      id: 'rec-3',
      title: 'Lauterbrunnen Valley E-Bike Cycling',
      category: 'OUTDOOR',
      suitability: 'SUITABLE',
      suitabilityScore: 84,
      rationale: 'Pleasant temperature for valley riding. Slight mountain shadow cooling expected by mid-afternoon.',
      timeSlot: '13:00 - 17:00',
      conditions: ['Paved Routes', 'Precip 12%', 'Temp 19°C'],
      icon: Activity,
    },
    {
      id: 'rec-4',
      title: 'Jungfrau Heritage Museum & Artisan Cafe',
      category: 'INDOOR',
      suitability: 'INDOOR_ALT',
      suitabilityScore: 98,
      rationale: 'Cozy indoor alternative featuring local alpine history, thermal indoor climate, and specialty coffee.',
      timeSlot: '11:00 - 18:00',
      conditions: ['Indoor Climate Controlled', 'All-Weather Suitable'],
      icon: Sparkles,
    },
    {
      id: 'rec-5',
      title: 'High-Altitude Paragliding Tandem Flight',
      category: 'OUTDOOR',
      suitability: 'CAUTION',
      suitabilityScore: 68,
      rationale: 'Thermal lift is moderate. Afternoon ridge wind shear requires flight coordinator clearance.',
      timeSlot: '10:00 - 12:30 Only',
      conditions: ['Thermal Wind 18 km/h', 'Thermals Active', 'Shear Check Req.'],
      icon: Wind,
    },
  ];

  const filteredRecommendations = recommendations.filter((rec) => {
    if (recommendationFilter === 'OUTDOOR') return rec.category === 'OUTDOOR' && rec.suitability !== 'CAUTION';
    if (recommendationFilter === 'CAUTION') return rec.suitability === 'CAUTION';
    if (recommendationFilter === 'INDOOR') return rec.category === 'INDOOR';
    return true;
  });

  return (
    <div className="space-y-10">
      {/* 1. Primary Weather Search Command Bar */}
      <section>
        <SearchPanel
          onSearch={handleSearch}
          currentLocation={locationName}
          isLoading={isSearching}
        />
      </section>

      {/* 2. Active Location & Context Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider shadow-specular-inset">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live MesoNet Feed
            </span>
            <span className="text-xs text-outline">
              Updated 2 mins ago • Doppler Station Verified
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-on-surface tracking-tight flex items-baseline gap-3 flex-wrap">
            <span>{locationName}</span>
            <span className="text-sm sm:text-base font-normal text-on-surface-variant font-body">
              {regionInfo}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-tertiary" />
            <span>Saturday, October 14, 2026 • Autumn Transition Inversion</span>
          </p>
        </div>

        {/* Favorite & Share Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsFavorited(!isFavorited)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border shadow-specular-inset ${
              isFavorited
                ? 'bg-tertiary/20 text-tertiary border-tertiary/30 hover:bg-tertiary/30'
                : 'bg-surface-container-high/80 text-outline border-white/10 hover:text-on-surface'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorited ? 'fill-tertiary text-tertiary' : 'text-outline'}`} />
            <span>{isFavorited ? 'Saved Location' : 'Save Location'}</span>
          </button>

          <Button variant="secondary" size="sm" icon={Share2}>
            Share Forecast
          </Button>
        </div>
      </section>

      {/* 3. Hero Atmospheric Snapshot (7 cols) + Secondary Telemetry Grid (5 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Hero Weather Panel (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-glass">
          {/* Specular Radial Gradients */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-tertiary/15 blur-3xl pointer-events-none" />
          <div className="absolute right-24 -bottom-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest font-display">
                Atmospheric Snapshot
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-5xl sm:text-6xl font-extrabold text-on-surface tracking-tight font-tabular">
                  19°
                </span>
                <span className="font-display text-2xl font-bold text-on-surface-variant">C</span>
                <span className="text-sm font-medium text-outline ml-3">Feels like 18°C</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <p className="font-display font-semibold text-lg text-on-surface">
                  Partly Sunny & Crisp Alpine Air
                </p>
              </div>
            </div>

            {/* Celestial Sun/Cloud Artwork */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
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
              <div className="flex items-center gap-1 font-semibold text-tertiary">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>High: 21°C</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Low: 11°C</span>
              </div>
              <div className="flex items-center gap-1 text-outline">
                <Gauge className="w-3.5 h-3.5 text-secondary" />
                <span>1018 hPa Steady</span>
              </div>
            </div>

            <Badge variant="primary" size="sm">
              Alpine Visibility: 25 km
            </Badge>
          </div>
        </div>

        {/* 6 Micro-Telemetry Cards (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          <WeatherMetricCard
            title="Precipitation"
            value="12"
            unit="%"
            description="Minimal (0.0 mm)"
            icon={Droplets}
            progress={12}
          />
          <WeatherMetricCard
            title="Wind & Gusts"
            value="14"
            unit="km/h"
            description="NW • Gusts to 19 km/h"
            icon={Wind}
          />
          <WeatherMetricCard
            title="UV Index"
            value="3.2"
            description="Moderate • 4h peak"
            icon={Sun}
            badgeText="Optimal"
            badgeVariant="optimal"
          />
          <WeatherMetricCard
            title="Humidity"
            value="58"
            unit="%"
            description="Comfortable dew point 10°"
            icon={Droplets}
            progress={58}
          />
          <WeatherMetricCard
            title="Air Quality"
            value="24"
            unit="AQI"
            description="Clean Alpine Air"
            icon={Sparkles}
            badgeText="Good"
            badgeVariant="optimal"
          />
          <WeatherMetricCard
            title="Pressure"
            value="1018"
            unit="hPa"
            description="Steady Barometric High"
            icon={Gauge}
          />
        </div>
      </section>

      {/* 4. Multi-Day Itinerary & 7-Day Forecast Ribbon */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight">
              7-Day Atmospheric Itinerary
            </h2>
            <p className="text-xs sm:text-sm text-outline">
              Hourly trajectory and meteorological window analysis.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary font-display hidden sm:inline-block">
            Next 7 Days
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {forecastDays.map((f, idx) => (
            <ForecastCard
              key={f.day}
              day={f.day}
              date={f.date}
              condition={f.condition}
              icon={f.icon}
              highTemp={f.high}
              lowTemp={f.low}
              precipChance={f.precip}
              isSelected={activeDayIndex === idx}
              onClick={() => setActiveDayIndex(idx)}
            />
          ))}
        </div>
      </section>

      {/* 5. Smart Activity Recommendations */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Tailored Activity Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-outline">
              Evaluated against real-time wind shear, UV, precipitation, and thermal metrics.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-surface-container-low/80 p-1 rounded-full border border-white/10 self-start sm:self-auto">
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
              Outdoor (3)
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
              Caution (1)
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
              Indoor Alt (1)
            </button>
          </div>
        </div>

        {/* Recommendation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              title={rec.title}
              category={rec.category}
              suitability={rec.suitability}
              suitabilityScore={rec.suitabilityScore}
              rationale={rec.rationale}
              timeSlot={rec.timeSlot}
              conditions={rec.conditions}
              icon={rec.icon}
            />
          ))}
        </div>
      </section>

      {/* 6. Saved Places Comparison Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-on-surface tracking-tight">
              Saved Locations Comparison
            </h2>
            <p className="text-xs sm:text-sm text-outline">
              Side-by-side meteorological snapshot across your favorite destinations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { city: 'Interlaken', country: 'Switzerland', temp: '19°C', condition: 'Partly Sunny', high: '21°', low: '11°', suitability: 'Optimal', icon: Sun },
            { city: 'Boulder', country: 'United States', temp: '22°C', condition: 'Sunny & Crisp', high: '24°', low: '12°', suitability: 'Optimal', icon: Sun },
            { city: 'Kyoto', country: 'Japan', temp: '16°C', condition: 'Passing Showers', high: '18°', low: '13°', suitability: 'Caution', icon: CloudRain },
            { city: 'Reykjavík', country: 'Iceland', temp: '8°C', condition: 'Breezy Subpolar', high: '9°', low: '4°', suitability: 'Indoor Favored', icon: Wind },
          ].map((place) => (
            <div
              key={place.city}
              className="p-5 rounded-2xl bg-surface-container-low/70 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all group flex flex-col justify-between shadow-specular-inset"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">{place.city}</h3>
                  <p className="text-xs text-outline font-medium">{place.country}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high/80 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <place.icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3 flex items-baseline justify-between">
                <span className="font-display font-extrabold text-2xl text-on-surface font-tabular">
                  {place.temp}
                </span>
                <span className="text-xs text-outline font-tabular">
                  {place.high} / {place.low}
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">{place.condition}</span>
                <Badge
                  variant={
                    place.suitability === 'Optimal'
                      ? 'optimal'
                      : place.suitability === 'Caution'
                      ? 'caution'
                      : 'indoor'
                  }
                  size="sm"
                >
                  {place.suitability}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Live System Health & PostgreSQL / Supabase Telemetry */}
      <section className="pt-4">
        <Card className="border-white/10 shadow-glass">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-glow">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  System Diagnostics & Supabase Telemetry
                  {healthData?.status === 'healthy' ? (
                    <Badge variant="optimal" size="sm" pulse>Active</Badge>
                  ) : healthError ? (
                    <Badge variant="danger" size="sm">Unreachable</Badge>
                  ) : (
                    <Badge variant="caution" size="sm">Probing...</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Verified communication between Vite client, Express backend, and Supabase PostgreSQL.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={loadingHealth}
              onClick={fetchHealth}
            >
              Re-probe API
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {healthError && (
              <Alert variant="error" title="Backend Connectivity Issue">
                {healthError}
              </Alert>
            )}

            {healthData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-surface-container-high/60 border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">API Service</span>
                  <p className="font-display font-bold text-sm text-on-surface">{healthData.service || 'SkyPlan REST API'}</p>
                  <p className="text-xs text-optimal font-medium">v{healthData.version || '0.1.0'} • Node.js/Express</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-high/60 border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">Supabase Database</span>
                  <p className="font-display font-bold text-sm text-on-surface">PostgreSQL Hosted</p>
                  <p className="text-xs text-optimal font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {healthData.database?.connected ? 'Connected via pg / SSL' : 'Standby'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-high/60 border border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-outline">Design System</span>
                  <p className="font-display font-bold text-sm text-on-surface">Google Stitch 2.0</p>
                  <p className="text-xs text-primary font-medium">Deep Atmospheric Navy</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
