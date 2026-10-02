import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Activity, 
  Server, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Terminal,
  Sun,
  CloudRain,
  Wind
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
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-4 pb-2 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Phase 0 Full-Stack Architecture Initialized</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Weather-Driven Decisions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Smarter Activity Planning</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          SkyPlan connects real-time OpenWeatherMap forecasts with an automated, rule-based recommendation engine to guide indoor and outdoor activity planning.
        </p>
      </section>

      {/* Backend & Database Live Diagnostics */}
      <section>
        <Card className="border-sky-200/80 shadow-glass overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sky-50/70 via-white to-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  System Diagnostic & Health Monitor
                  {healthData?.status === 'healthy' ? (
                    <Badge variant="success" size="sm">System Operational</Badge>
                  ) : error ? (
                    <Badge variant="danger" size="sm">Backend Unreachable</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">Probing...</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Live verification of frontend-to-backend REST API communication and database connectivity.
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
              Test API Connection
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="error" title="Backend Connection Failed">
                {error} — Ensure the Express backend server is running at <code className="font-mono bg-rose-100/80 px-1.5 py-0.5 rounded text-xs">{healthService.apiClient ? healthService.apiClient.getBaseUrl() : 'http://localhost:5000/api'}</code>.
              </Alert>
            )}

            {healthData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Service Status</span>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-base font-bold text-slate-900">{healthData.service}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">Version {healthData.version}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Database Layer</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-600" />
                    <span className="text-base font-bold text-slate-900">
                      {healthData.database?.connected ? 'Connected' : 'Configured (Standby)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 truncate" title={healthData.database?.message}>
                    {healthData.database?.message || 'PostgreSQL Connection Layer'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Environment</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <span className="text-base font-bold text-slate-900 capitalize">{healthData.environment}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">Uptime: {Math.floor(healthData.uptime)}s</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Last Verification</span>
                  <div className="mt-2 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-slate-600" />
                    <span className="text-base font-bold text-slate-900">{lastChecked || 'Just now'}</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1">HTTP 200 OK</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Google Stitch Design System Primitives Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Google Stitch Design Primitives</h2>
            <p className="text-sm text-slate-500">Curated design tokens, typography, interactive states, and reusable components ready for Phase 1+.</p>
          </div>
          <Badge variant="primary">Design Tokens Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Button Variants Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Action Primitives</h3>
            <div className="flex flex-col gap-2.5">
              <Button variant="primary" size="md">Primary Action</Button>
              <Button variant="secondary" size="md">Secondary Action</Button>
              <Button variant="outline" size="md">Outline Action</Button>
              <Button variant="ghost" size="md">Ghost Action</Button>
            </div>
          </Card>

          {/* Activity Classification Tokens */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Activity & Weather Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outdoor" icon={Sun}>Outdoor Activity</Badge>
              <Badge variant="indoor" icon={CloudRain}>Indoor Activity</Badge>
              <Badge variant="primary" icon={Wind}>Breezy (5 m/s)</Badge>
              <Badge variant="success">Suitable Plan</Badge>
              <Badge variant="warning">Caution: Rain</Badge>
              <Badge variant="danger">Unfavorable</Badge>
              <Badge variant="neutral">Tag: Jogging</Badge>
              <Badge variant="neutral">Tag: Picnics</Badge>
            </div>
          </Card>

          {/* Form Control Primitives */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Form Controls</h3>
            <div className="space-y-3">
              <Input
                label="City Search Input (Preview)"
                placeholder="e.g., Tokyo, New York, Manila..."
                icon={Compass}
                disabled
                helperText="Active search will be enabled in Phase 5."
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Implementation Roadmap & Phase 0 Status */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Implementation Roadmap Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-emerald-500 bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase">Phase 0</span>
              <Badge variant="success" size="sm">Completed</Badge>
            </div>
            <h4 className="font-semibold text-slate-900 mt-2">Project Foundation</h4>
            <p className="text-xs text-slate-500 mt-1">Full-stack React + Express setup, Stitch UI tokens, Git & API proxy foundation.</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-sky-500 bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 uppercase">Phase 1</span>
              <Badge variant="primary" size="sm">Up Next</Badge>
            </div>
            <h4 className="font-semibold text-slate-900 mt-2">Authentication & Profiles</h4>
            <p className="text-xs text-slate-500 mt-1">JWT authentication, registration, login, user roles, profile and interest tags.</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-slate-300 bg-white/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Phase 2 – 5</span>
              <Badge variant="neutral" size="sm">Planned</Badge>
            </div>
            <h4 className="font-semibold text-slate-900 mt-2">Weather & Planning Core</h4>
            <p className="text-xs text-slate-500 mt-1">OpenWeatherMap integration, multi-day forecast, recommendation rules, favorites & history.</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-slate-300 bg-white/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Phase 6 – 12</span>
              <Badge variant="neutral" size="sm">Planned</Badge>
            </div>
            <h4 className="font-semibold text-slate-900 mt-2">Admin, QA & Cloud Deploy</h4>
            <p className="text-xs text-slate-500 mt-1">Guest limits, admin reporting & rules, testing, Vercel + Render production deployment.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
