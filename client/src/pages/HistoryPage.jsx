import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Search, 
  Trash2, 
  Calendar, 
  CloudSun, 
  ArrowRight, 
  RefreshCw, 
  Sparkles,
  ExternalLink,
  CalendarPlus,
  Compass
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import historyService from '../services/historyService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Alert from '../components/common/Alert';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useTemperature } from '../context/TemperatureContext';

export default function HistoryPage() {
  const { toDisplayTemp, unitSymbol } = useTemperature();
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await historyService.getSearchHistory(50);
      setHistoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch search history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your search and activity history?')) return;
    setIsClearing(true);
    try {
      await historyService.clearSearchHistory();
      setHistoryItems([]);
    } catch (err) {
      alert(err.message || 'Failed to clear history.');
    } finally {
      setIsClearing(false);
    }
  };

  const filteredHistory = historyItems.filter((item) =>
    searchFilter.trim() === ''
      ? true
      : item.city_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider shadow-specular-inset">
              <Clock className="w-3.5 h-3.5" />
              Activity Telemetry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            History & Recent Activities
          </h1>
          <p className="text-xs sm:text-sm text-outline">
            Review your past location searches, weather conditions at query time, and quick actions to plan trips.
          </p>
        </div>

        {historyItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={Trash2}
            isLoading={isClearing}
            onClick={handleClearHistory}
            className="text-error border-error/30 hover:bg-error-container/20"
          >
            Clear All History
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search recent queries by city..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container-high/80 border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-outline"
          />
        </div>

        <div className="text-xs text-outline font-semibold">
          {historyItems.length} Recorded Quer{historyItems.length === 1 ? 'y' : 'ies'}
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* History Items Grid */}
      {isLoading ? (
        <div className="space-y-3">
          <LoadingSkeleton variant="rectangle" count={4} />
        </div>
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          title="No search history found"
          description={
            searchFilter
              ? 'No recent destinations match your filter criteria.'
              : 'Your search history is empty. Look up cities on the dashboard to build your activity history!'
          }
          icon={Clock}
          action={
            <Link to="/">
              <Button variant="primary">Go to Planner Dashboard</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const summary = item.weather_summary_json || {};
            const dateStr = item.searched_at
              ? new Date(item.searched_at).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface-container-low/80 backdrop-blur-md border border-white/10 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-specular-inset group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg text-on-surface">
                        {item.city_name}
                      </h3>
                      {item.requested_date && (
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary text-[10px] font-bold uppercase tracking-wider">
                          Window: {item.requested_date}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-outline flex items-center gap-2">
                      <Clock className="w-3 h-3 text-tertiary" />
                      <span>{dateStr}</span>
                    </p>
                  </div>
                </div>

                {/* Weather telemetry pill & Actions */}
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  {(summary.temp !== undefined || summary.condition) && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high/60 border border-white/5 text-xs text-on-surface font-tabular">
                      <CloudSun className="w-4 h-4 text-primary" />
                      <span className="font-bold">{summary.temp !== undefined ? `${toDisplayTemp(summary.temp)}${unitSymbol}` : ''}</span>
                      {summary.condition && <span className="text-outline">{summary.condition}</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link to={`/?city=${encodeURIComponent(item.city_name)}`}>
                      <Button variant="secondary" size="sm" icon={ExternalLink}>
                        Inspect Weather
                      </Button>
                    </Link>
                    <Link to="/itineraries">
                      <Button variant="primary" size="sm" icon={CalendarPlus}>
                        Plan Itinerary
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
