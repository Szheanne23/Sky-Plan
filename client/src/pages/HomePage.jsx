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
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import healthService from '../services/healthService';

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthService.checkHealth();
      setHealthData(response.data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Failed to connect to backend.');
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-2 pb-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary text-xs font-semibold shadow-specular-inset">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Stitch UI/UX Reference Architecture Locked</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-on-surface tracking-tight leading-tight">
          Atmospheric Elevation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">Activity Intelligence</span>
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
          SkyPlan bridges meteorological telemetry with deterministic activity rules to recommend optimal outdoor outings and indoor alternatives.
        </p>
      </section>

      {/* Backend & Health Diagnostics Card */}
      <section>
        <Card className="border-primary/20 shadow-glass">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-glow">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  System Diagnostics & REST Telemetry
                  {healthData?.status === 'healthy' ? (
                    <Badge variant="optimal" size="sm" pulse>Online</Badge>
                  ) : error ? (
                    <Badge variant="danger" size="sm">Unreachable</Badge>
                  ) : (
                    <Badge variant="caution" size="sm">Probing...</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Verified communication between Vite client and Node.js/Express backend service.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={loading}
              onClick={fetchHealth}
            >
              Probe API Health
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="error" title="Backend Connection Offline">
                {error} — Verify Express server is listening at <code className="font-mono bg-error-container/40 px-1.5 py-0.5 rounded text-xs">{healthService.apiClient ? healthService.apiClient.getBaseUrl() : 'http://localhost:5000/api'}</code>.
              </Alert>
            )}

            {healthData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-surface-container/60 border border-white/5 flex flex-col justify-between shadow-specular-inset">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline">API Service</span>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-optimal" />
                    <span className="text-base font-bold text-on-surface font-display">{healthData.service}</span>
                  </div>
                  <span className="text-[11px] text-outline mt-1 font-tabular">Version {healthData.version}</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container/60 border border-white/5 flex flex-col justify-between shadow-specular-inset">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline">Database Layer</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    <span className="text-base font-bold text-on-surface font-display">
                      {healthData.database?.connected ? 'Connected' : 'Configured (Standby)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-1 truncate" title={healthData.database?.message}>
                    {healthData.database?.message || 'PostgreSQL Connection Layer'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container/60 border border-white/5 flex flex-col justify-between shadow-specular-inset">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline">Environment</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-secondary" />
                    <span className="text-base font-bold text-on-surface capitalize font-display">{healthData.environment}</span>
                  </div>
                  <span className="text-[11px] text-outline mt-1 font-tabular">Uptime: {Math.floor(healthData.uptime)}s</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-container/60 border border-white/5 flex flex-col justify-between shadow-specular-inset">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline">HTTP Telemetry</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-tertiary" />
                    <span className="text-base font-bold text-on-surface font-display font-tabular">{lastChecked || 'Active'}</span>
                  </div>
                  <span className="text-[11px] text-optimal font-medium mt-1">HTTP 200 OK</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Stitch Design System Foundation: Atmospheric Hero & Telemetry Grid Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight">Stitch Atmospheric Hero & Telemetry Archetype</h2>
            <p className="text-sm text-on-surface-variant">Standardized visual layout extracted directly from the Stitch weather planning reference.</p>
          </div>
          <Badge variant="primary">Stitch Reference Archetype</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Hero Weather Panel (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-surface-container-low/90 backdrop-blur-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-glass">
            {/* Ambient light gradient background bubbles */}
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />
            <div className="absolute right-20 bottom-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary font-mono">Atmospheric Snapshot</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display text-6xl font-extrabold text-on-surface tracking-tight font-tabular">19°</span>
                  <span className="font-display text-2xl font-semibold text-on-surface-variant">C</span>
                  <span className="text-sm text-outline ml-2 font-tabular">Feels like 18°</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-optimal animate-pulse" />
                  <p className="text-base font-semibold text-on-surface font-display">Partly Sunny & Crisp</p>
                </div>
              </div>

              {/* Weather Glyph Illustration */}
              <div className="w-24 h-24 rounded-2xl bg-surface-container flex items-center justify-center border border-white/10 shadow-specular-inset">
                <Sun className="w-12 h-12 text-tertiary" />
              </div>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-white/5 flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-4 text-xs font-tabular">
                <span className="text-on-surface font-medium flex items-center gap-1">
                  <span className="text-tertiary font-bold">↑</span> High: 21°C
                </span>
                <span className="text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="text-primary font-bold">↓</span> Low: 11°C
                </span>
                <span className="text-outline">1018 hPa Steady</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container font-medium text-xs text-primary border border-white/5">
                High Alpine Visibility • 25km
              </span>
            </div>
          </div>

          {/* Quick Atmospheric Metrics Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-4 flex flex-col justify-between border border-white/10 shadow-glass">
              <div className="flex items-center justify-between text-outline text-xs font-medium">
                <span>Precipitation</span>
                <CloudRain className="w-4 h-4 text-primary" />
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-on-surface font-tabular">12%</div>
                <div className="text-xs text-on-surface-variant">Minimal (0.0 mm)</div>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-4 flex flex-col justify-between border border-white/10 shadow-glass">
              <div className="flex items-center justify-between text-outline text-xs font-medium">
                <span>Wind Velocity</span>
                <Wind className="w-4 h-4 text-secondary" />
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-on-surface font-tabular">8 km/h</div>
                <div className="text-xs text-on-surface-variant">NW Light Breeze</div>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-4 flex flex-col justify-between border border-white/10 shadow-glass">
              <div className="flex items-center justify-between text-outline text-xs font-medium">
                <span>UV Index</span>
                <Sun className="w-4 h-4 text-tertiary" />
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-on-surface font-tabular">4.2</div>
                <div className="text-xs text-optimal font-medium">Moderate Solar</div>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl p-4 flex flex-col justify-between border border-white/10 shadow-glass">
              <div className="flex items-center justify-between text-outline text-xs font-medium">
                <span>Air Quality</span>
                <Gauge className="w-4 h-4 text-optimal" />
              </div>
              <div className="mt-3">
                <div className="font-display text-2xl font-bold text-on-surface font-tabular">22 AQI</div>
                <div className="text-xs text-optimal font-medium">Glacial Pure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stitch Design System Foundation: Activity Suitability Archetype */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight">Activity Recommendation Archetype Cards</h2>
            <p className="text-sm text-on-surface-variant">Pill badges, suitability indicators, and rationale layout defined by Stitch.</p>
          </div>
          <Badge variant="optimal">Deterministic Rules Ready</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Optimal Outdoor */}
          <Card className="p-6 space-y-4 border-optimal/20">
            <div className="flex items-center justify-between">
              <Badge variant="outdoor">Outdoor Recreation</Badge>
              <Badge variant="optimal" pulse>98% Optimal</Badge>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Alpine Trail Hiking</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Clear skies, 19°C temperature, and low 8 km/h wind create ideal conditions for high-elevation ridge hikes.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-outline font-tabular">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> 10:00 AM – 4:00 PM</span>
              <span className="text-optimal font-semibold">Dry Paths</span>
            </div>
          </Card>

          {/* Card 2: Caution */}
          <Card className="p-6 space-y-4 border-caution/20">
            <div className="flex items-center justify-between">
              <Badge variant="outdoor">Outdoor Sport</Badge>
              <Badge variant="caution">Caution: Gusts</Badge>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Open-Water Kayaking</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Thermal winds expected to increase in the late afternoon. Safe in morning bays; caution on open lakes.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-outline font-tabular">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-tertiary" /> 8:00 AM – 12:30 PM</span>
              <span className="text-caution font-semibold">Moderate Chop</span>
            </div>
          </Card>

          {/* Card 3: Indoor Alternative */}
          <Card className="p-6 space-y-4 border-azure/20">
            <div className="flex items-center justify-between">
              <Badge variant="indoor">Indoor Cultural</Badge>
              <Badge variant="secondary">Alternative Choice</Badge>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Modern Art Museum Tour</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Climate-controlled galleries and cafe spaces unaffected by afternoon cloud build-up or temperature drops.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs text-outline font-tabular">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-secondary" /> All Day (10 AM – 7 PM)</span>
              <span className="text-secondary font-semibold">Indoor Climate</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Action Primitives & Form Controls Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight">Interactive Stitch Primitives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">Action Buttons</h3>
            <div className="flex flex-col gap-2.5">
              <Button variant="primary" size="md">Primary Pill Action</Button>
              <Button variant="secondary" size="md">Secondary Atmospheric Pill</Button>
              <Button variant="outline" size="md">Frosted Glass Action</Button>
              <Button variant="caution" size="md">Solar Caution Action</Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">Category Tags & Status Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="optimal" pulse>Optimal Window</Badge>
              <Badge variant="caution">Caution: Rain</Badge>
              <Badge variant="primary">Luminous Cyan</Badge>
              <Badge variant="secondary">Twilight Blue</Badge>
              <Badge variant="tertiary">Solar Amber</Badge>
              <Badge variant="indoor">Indoor Cultural</Badge>
              <Badge variant="outdoor">Outdoor Trail</Badge>
              <Badge variant="neutral">Tag: Cycling</Badge>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">Capsule Form Input</h3>
            <div className="space-y-3">
              <Input
                label="Location Search Capsule"
                placeholder="e.g., Interlaken, Denver, Kyoto..."
                icon={Compass}
                disabled
                helperText="Active search will query OpenWeatherMap in Phase 2."
              />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
