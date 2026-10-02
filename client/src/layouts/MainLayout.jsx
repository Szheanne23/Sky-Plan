import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CloudSun, User, LogIn, LogOut, Shield, Layers, Tag, ChevronDown } from 'lucide-react';
import healthService from '../services/healthService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function MainLayout() {
  const [apiHealth, setApiHealth] = useState({ status: 'checking', message: 'Checking API...' });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
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
                  Phase 1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Weather-Based Activity Planner</p>
            </div>
          </Link>

          {/* Navigation Links & System Health */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live API Health Status Badge */}
            <div className="hidden md:flex items-center gap-2 pl-3 pr-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-xs">
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
                API:{' '}
                <strong className={apiHealth.status === 'online' ? 'text-emerald-700 font-semibold' : 'text-slate-700'}>
                  {apiHealth.status === 'online' ? 'Healthy' : 'Offline'}
                </strong>
              </span>
            </div>

            {/* Nav links */}
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </Link>

            {/* Authentication Controls */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs transition-all text-sm font-medium text-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">{user?.displayName || 'My Account'}</span>
                  <Badge variant={user?.role === 'ADMIN' ? 'warning' : 'primary'} size="sm" className="hidden lg:inline-flex">
                    {user?.role}
                  </Badge>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-glass-hover p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-slate-100 text-xs">
                        <p className="font-semibold text-slate-900 truncate">{user?.displayName}</p>
                        <p className="text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Preferences</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" icon={LogIn}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
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
            <span className="ml-2 text-slate-400">IPT2 Academic Proposal Baseline.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <Layers className="w-3.5 h-3.5 text-sky-600" /> React + Tailwind + Express + PostgreSQL
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Phase 1 Authentication
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
