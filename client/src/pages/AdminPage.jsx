import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  Sliders, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Sparkles,
  MapPin,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import adminService from '../services/adminService';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'rules' | 'users'
  const [analytics, setAnalytics] = useState(null);
  const [rules, setRules] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingRuleId, setUpdatingRuleId] = useState(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsData, rulesData, usersData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getRules(),
        adminService.getUsers(),
      ]);
      setAnalytics(analyticsData);
      setRules(Array.isArray(rulesData) ? rulesData : (rulesData?.rules || []));
      setUsers(Array.isArray(usersData) ? usersData : (usersData?.users || []));
    } catch (err) {
      setError(err.message || 'Failed to load administrative telemetry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRule = async (rule) => {
    setUpdatingRuleId(rule.id);
    try {
      const updated = await adminService.updateRule(rule.id, {
        is_active: !rule.is_active,
      });
      const nextActive = updated?.is_active !== undefined ? updated.is_active : !rule.is_active;
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: nextActive } : r))
      );
    } catch (err) {
      alert(err.message || 'Failed to update recommendation rule.');
    } finally {
      setUpdatingRuleId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tertiary/20 border border-tertiary/30 text-tertiary text-xs font-bold uppercase tracking-wider shadow-specular-inset">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Command Center
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            System Telemetry & Rule Engine
          </h1>
          <p className="text-xs sm:text-sm text-outline">
            Real-time usage telemetry, activity recommendation rule matrix, and account registry.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          isLoading={isLoading}
          onClick={fetchAdminData}
        >
          Refresh Telemetry
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Administrative Access Notice">
          {error}
        </Alert>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 bg-surface-container-low/80 p-1 rounded-full border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-primary-container text-on-primary-container shadow-glow'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Usage Telemetry</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'rules'
              ? 'bg-primary-container text-on-primary-container shadow-glow'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Recommendation Rules ({rules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-primary-container text-on-primary-container shadow-glow'
              : 'text-outline hover:text-on-surface'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Registry ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Telemetry & Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 shadow-glass space-y-2">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Registered</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-extrabold font-display text-on-surface font-tabular">
                {analytics.overview?.totalUsers || 0}
              </p>
              <span className="text-[11px] text-optimal font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {analytics.overview?.activeUsers || 0} active in 30 days
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 shadow-glass space-y-2">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Weather Searches</span>
                <Search className="w-4 h-4 text-tertiary" />
              </div>
              <p className="text-3xl font-extrabold font-display text-on-surface font-tabular">
                {analytics.overview?.totalSearches || 0}
              </p>
              <span className="text-[11px] text-tertiary font-medium">
                {analytics.overview?.searchesToday || 0} queries executed today
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 shadow-glass space-y-2">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs font-semibold uppercase tracking-wider">Guest Searches</span>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-3xl font-extrabold font-display text-on-surface font-tabular">
                {analytics.overview?.guestSearches || 0}
              </p>
              <span className="text-[11px] text-outline font-medium">
                Unauthenticated lookups logged
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 shadow-glass space-y-2">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs font-semibold uppercase tracking-wider">Saved Bookmarks</span>
                <Sparkles className="w-4 h-4 text-optimal" />
              </div>
              <p className="text-3xl font-extrabold font-display text-on-surface font-tabular">
                {analytics.overview?.totalFavorites || 0}
              </p>
              <span className="text-[11px] text-optimal font-medium">
                Pinned cities across all users
              </span>
            </div>
          </div>

          {/* Popular Search Destinations */}
          <Card className="border-white/10 shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Popular Query Destinations (Chart.js Visualization)
              </CardTitle>
              <CardDescription>
                Aggregated search query frequency stored across live weather telemetry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chart.js Bar Chart */}
              {analytics.popularSearches && analytics.popularSearches.length > 0 && (
                <div className="h-56 w-full p-2 bg-surface-container-high/30 rounded-2xl border border-white/5">
                  <Bar
                    data={{
                      labels: analytics.popularSearches.map((d) => d.city_name),
                      datasets: [
                        {
                          label: 'Search Volume',
                          data: analytics.popularSearches.map((d) => d.search_count),
                          backgroundColor: 'rgba(76, 214, 251, 0.45)',
                          borderColor: '#4cd6fb',
                          borderWidth: 1.5,
                          borderRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(19, 26, 51, 0.95)',
                          titleColor: '#dbe1ff',
                          bodyColor: '#bcc9ce',
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: '#869398' },
                        },
                        y: {
                          grid: { color: 'rgba(255, 255, 255, 0.05)' },
                          ticks: { color: '#869398', stepSize: 1 },
                        },
                      },
                    }}
                  />
                </div>
              )}

              {analytics.popularSearches?.length === 0 ? (
                <EmptyState
                  title="No search telemetry yet"
                  description="Destination search frequencies will populate here as users query the system."
                  icon={Search}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analytics.popularSearches?.map((dest, idx) => (
                    <div
                      key={dest.city_name}
                      className="p-4 rounded-2xl bg-surface-container-high/50 border border-white/5 flex items-center justify-between shadow-specular-inset"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-surface-container-low text-primary font-bold text-xs flex items-center justify-center font-tabular">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-display font-bold text-sm text-on-surface">{dest.city_name}</p>
                          <p className="text-[11px] text-outline">
                            Last searched {new Date(dest.last_searched).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="primary" size="sm" className="font-tabular">
                        {dest.search_count} queries
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Recommendation Rules Matrix */}
      {activeTab === 'rules' && (
        <Card className="border-white/10 shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Rule-Based Recommendation Engine Matrix
            </CardTitle>
            <CardDescription>
              Evaluation parameters, suitability thresholds, and active status for outdoor &amp; indoor activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-outline uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Activity / Rule Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Temp Range</th>
                    <th className="py-3 px-4">Weather Filter</th>
                    <th className="py-3 px-4">Max Wind</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rules.map((rule) => {
                    const category = rule.activity_category || rule.category || 'OUTDOOR';
                    const minT = rule.min_temp ?? rule.min_temp_c;
                    const maxT = rule.max_temp ?? rule.max_temp_c;
                    const maxW = rule.max_wind_speed ?? rule.max_wind_speed_kmh;
                    const conditions = Array.isArray(rule.allowed_weather_conditions)
                      ? rule.allowed_weather_conditions.join(', ')
                      : (rule.weather_condition || 'All Conditions');

                    return (
                      <tr key={rule.id} className="hover:bg-surface-container-high/40 transition-colors">
                        <td className="py-3.5 px-4 font-display font-bold text-on-surface">
                          {rule.activity_name || rule.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={category === 'OUTDOOR' ? 'primary' : 'indoor'} size="sm">
                            {category}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-tabular text-on-surface-variant">
                          {minT !== null && minT !== undefined ? `${minT}°C` : 'Any'} –{' '}
                          {maxT !== null && maxT !== undefined ? `${maxT}°C` : 'Any'}
                        </td>
                        <td className="py-3.5 px-4 text-outline font-mono max-w-[200px] truncate" title={conditions}>
                          {conditions}
                        </td>
                        <td className="py-3.5 px-4 font-tabular text-outline">
                          {maxW ? `≤ ${maxW} km/h` : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              rule.is_active ? 'text-optimal' : 'text-outline'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                rule.is_active ? 'bg-optimal' : 'bg-outline'
                              }`}
                            />
                            {rule.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant={rule.is_active ? 'outline' : 'primary'}
                            size="sm"
                            isLoading={updatingRuleId === rule.id}
                            onClick={() => handleToggleRule(rule)}
                          >
                            {rule.is_active ? 'Disable' : 'Enable'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: User Accounts Registry */}
      {activeTab === 'users' && (
        <Card className="border-white/10 shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Registered User Accounts
            </CardTitle>
            <CardDescription>
              Registered user accounts with role, registration date, and telemetry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-outline uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 font-tabular text-right">Search Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-high/40 transition-colors">
                      <td className="py-3.5 px-4 font-display font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs">
                            {(u.display_name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span>{u.display_name || u.email?.split('@')[0]}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={u.role === 'ADMIN' ? 'caution' : 'primary'} size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-outline">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-tabular text-right font-bold text-on-surface">
                        {u.saved_cities_count ?? u.search_count ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
