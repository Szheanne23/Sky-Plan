import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  CloudSun, 
  MapPin, 
  Calendar, 
  Bell, 
  User, 
  LogIn, 
  LogOut, 
  Shield, 
  Layers, 
  Search, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  Compass,
  Sliders,
  SlidersHorizontal,
  Home,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import healthService from '../services/healthService';
import { useAuth } from '../context/AuthContext';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function MainLayout() {
  const [apiHealth, setApiHealth] = useState({ status: 'checking', message: 'Checking API...' });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { unit, setUnit } = useTemperature();
  const { theme, setTheme, toggleTheme, isDay } = useTheme();
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
            db: response?.data?.database?.connected ? 'Online' : 'Standby',
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
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-primary selection:text-on-primary font-body">
      {/* Modern Sleek Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-2xl border-b border-white/10 shadow-glass">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Left: Brand Logo & Main Nav Links */}
            <div className="flex items-center gap-3 sm:gap-8 shrink-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <CloudSun className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-on-surface">SkyPlan</span>
                  <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25">
                    Philippines • Live
                  </span>
                </div>
              </Link>

              {/* Integrated Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1.5" role="tablist">
                <Link
                  to="/"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    location.pathname === '/'
                      ? 'bg-primary-container text-on-primary-container shadow-glow'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  Dashboard & Planner
                </Link>
                <Link
                  to="/itineraries"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    location.pathname === '/itineraries'
                      ? 'bg-primary-container text-on-primary-container shadow-glow'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Itineraries</span>
                </Link>
                <Link
                  to="/history"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    location.pathname === '/history'
                      ? 'bg-primary-container text-on-primary-container shadow-glow'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Activities</span>
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      location.pathname === '/profile'
                        ? 'bg-primary-container text-on-primary-container shadow-glow'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    My Preferences
                  </Link>
                )}
                {isAuthenticated && user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      location.pathname === '/admin'
                        ? 'bg-tertiary-container text-on-tertiary-container shadow-glow-amber'
                        : 'text-tertiary hover:bg-tertiary/20'
                    }`}
                  >
                    Admin Portal
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: Controls, Beacon, Auth */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Temperature Unit Toggle (°C / °F) */}
              <div className="hidden sm:flex items-center bg-surface-container-low rounded-full p-0.5 border border-white/10 shadow-specular-inset">
                <button
                  type="button"
                  onClick={() => setUnit('C')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    unit === 'C' ? 'bg-primary-container text-on-primary-container shadow-glow' : 'text-outline hover:text-on-surface'
                  }`}
                  aria-label="Celsius mode"
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('F')}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    unit === 'F' ? 'bg-primary-container text-on-primary-container shadow-glow' : 'text-outline hover:text-on-surface'
                  }`}
                  aria-label="Fahrenheit mode"
                >
                  °F
                </button>
              </div>

              {/* Day / Night Theme Toggle */}
              <div className="flex items-center bg-surface-container-low rounded-full p-0.5 border border-white/10 shadow-specular-inset">
                <button
                  type="button"
                  onClick={() => setTheme('day')}
                  className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                    theme === 'day'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  aria-label="Day theme (Light mode)"
                  title="Day theme (Light mode)"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('night')}
                  className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                    theme === 'night'
                      ? 'bg-primary-container text-on-primary-container shadow-glow'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  aria-label="Night theme (Dark mode)"
                  title="Night theme (Dark mode)"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* System Telemetry Beacon */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 border border-white/10 text-xs text-on-surface shadow-specular-inset">
                <span className="relative flex h-2 w-2">
                  {apiHealth.status === 'online' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-optimal opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      apiHealth.status === 'online'
                        ? 'bg-optimal'
                        : apiHealth.status === 'checking'
                        ? 'bg-caution'
                        : 'bg-error'
                    }`}
                  />
                </span>
                <span className="text-outline text-[11px]">System:</span>
                <strong className={apiHealth.status === 'online' ? 'text-optimal font-semibold text-[11px]' : 'text-error text-[11px]'}>
                  {apiHealth.status === 'online' ? 'Live' : 'Offline'}
                </strong>
              </div>

              {/* User Identity / Authentication Controls */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-surface-container-high/90 border border-white/15 hover:border-white/30 text-on-surface transition-all text-xs font-medium shadow-specular-inset focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container text-white flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0">
                      {user?.avatarUrl ? (
                        user.avatarUrl.startsWith('http') ? (
                          <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[11px] leading-none">{user.avatarUrl}</span>
                        )
                      ) : (
                        user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>
                    <span className="hidden md:inline-block max-w-[110px] truncate text-on-surface font-semibold">
                      {user?.displayName || 'My Account'}
                    </span>
                    <Badge variant={user?.role === 'ADMIN' ? 'caution' : 'primary'} size="sm" className="hidden xl:inline-flex">
                      {user?.role}
                    </Badge>
                    <ChevronDown className="w-3.5 h-3.5 text-outline" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-container-low border border-white/15 shadow-glass-hover p-2 z-50 space-y-1 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 border-b border-white/10 text-xs">
                          <p className="font-bold text-on-surface truncate font-display">{user?.displayName}</p>
                          <p className="text-outline text-[11px] truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                        >
                          <User className="w-4 h-4 text-outline" />
                          <span>Profile & Preferences</span>
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-tertiary hover:bg-tertiary/20 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-tertiary" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-error hover:bg-error-container/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-error" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="px-2 sm:px-3 py-1 text-xs h-8">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="px-2.5 sm:px-3 py-1 text-xs h-8 shadow-glow whitespace-nowrap">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-white/10 bg-surface-container-lowest/95 backdrop-blur-2xl space-y-3 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/'
                    ? 'bg-primary-container text-on-primary-container shadow-glow'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Dashboard & Forecast</span>
              </Link>
              <Link
                to="/itineraries"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/itineraries'
                    ? 'bg-primary-container text-on-primary-container shadow-glow'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Itineraries</span>
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/history'
                    ? 'bg-primary-container text-on-primary-container shadow-glow'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Recent Activities</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      location.pathname === '/profile'
                        ? 'bg-primary-container text-on-primary-container shadow-glow'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile & Preferences</span>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/admin'
                          ? 'bg-tertiary-container text-on-tertiary-container shadow-glow-amber'
                          : 'text-tertiary hover:bg-tertiary/20'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Quick Preferences (Theme & Temperature) */}
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-outline font-medium">Display & Unit</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-surface-container-low rounded-full p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setTheme('day')}
                      className={`p-1.5 rounded-full ${theme === 'day' ? 'bg-amber-400 text-slate-950' : 'text-outline'}`}
                      aria-label="Day theme"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('night')}
                      className={`p-1.5 rounded-full ${theme === 'night' ? 'bg-primary-container text-on-primary-container' : 'text-outline'}`}
                      aria-label="Night theme"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center bg-surface-container-low rounded-full p-0.5 border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setUnit('C')}
                      className={`px-2 py-0.5 rounded-full font-semibold ${unit === 'C' ? 'bg-primary-container text-on-primary-container' : 'text-outline'}`}
                    >
                      °C
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('F')}
                      className={`px-2 py-0.5 rounded-full font-semibold ${unit === 'F' ? 'bg-primary-container text-on-primary-container' : 'text-outline'}`}
                    >
                      °F
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        <Outlet />
      </main>

      {/* Atmospheric Footer */}
      <footer className="border-t border-white/5 bg-surface-container-lowest/80 backdrop-blur-md py-6 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline">
          <div>
            <span className="font-bold text-on-surface font-display">SkyPlan Philippines</span> — Weather-Based Activity Planner &copy; 2026.
            <span className="ml-2 text-outline/80">Localized for Philippine cities, provinces, and tropical island destinations.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-on-surface-variant font-medium">
              <Layers className="w-3.5 h-3.5 text-primary" /> React + Tailwind + Express + PostgreSQL
            </span>
            <span className="inline-flex items-center gap-1 text-optimal font-medium">
              <Shield className="w-3.5 h-3.5" /> System Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
