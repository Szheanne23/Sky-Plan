import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CloudSun, Activity, Database, Shield, Layers, ExternalLink } from 'lucide-react';
import healthService from '../services/healthService';
import Badge from '../components/common/Badge';

export default function MainLayout() {
  const [apiHealth, setApiHealth] = useState({ status: 'checking', message: 'Checking API...' });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    async function verifyBackend() {
      try {
        const response = await healthService.checkHealth();
        if (isMounted) {
          setApiHealth({
            status: 'online',
            service: response?.data?.service || 'SkyPlan API',
            db: response?.data?.database?.connected ? 'Connected' : 'Configured (Standby)',
          });
        }
      } catch (err) {
        if (isMounted) {
          setApiHealth({
            status: 'offline',
            message: 'API Offline or Unreachable',
          });
        }
      }
    }

    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">SkyPlan</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  Phase 0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Weather-Based Activity Planner</p>
            </div>
          </Link>

          {/* Navigation Links & System Health */}
          <div className="flex items-center gap-4">
            {/* Live API Health Status Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-xs">
              <span className="relative flex h-2 w-2">
                {apiHealth.status === 'online' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    apiHealth.status === 'online'
                      ? 'bg-emerald-500'
                      : apiHealth.status === 'checking'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                ></span>
              </span>
              <span className="text-slate-600">
                Backend API:{' '}
                <strong className={apiHealth.status === 'online' ? 'text-emerald-700 font-semibold' : 'text-slate-700'}>
                  {apiHealth.status === 'online' ? 'Healthy (v0.1.0)' : apiHealth.status === 'checking' ? 'Connecting...' : 'Offline'}
                </strong>
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Foundation Shell
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">SkyPlan</span> — Weather-Based Activity Planner &copy; 2026.
            <span className="ml-2 text-slate-400">IPT2 Academic Proposal Baseline (September 19, 2026).</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <Layers className="w-3.5 h-3.5 text-sky-600" /> React + Tailwind + Express + PostgreSQL
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Phase 0 Foundation
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
