import React, { useState, useEffect } from 'react';
import { Clock, Trash2, X, MapPin, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import historyService from '../../services/historyService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

export default function HistoryDrawer({ isOpen, onClose, onSelectCity }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await historyService.getSearchHistory(30);
      const list = Array.isArray(data) ? data : (data?.history || []);
      setHistoryItems(list);
    } catch (err) {
      setError(err.message || 'Failed to load search history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all your search history records?')) return;
    setIsClearing(true);
    try {
      await historyService.clearSearchHistory();
      setHistoryItems([]);
    } catch (err) {
      alert(err.message || 'Failed to clear search history.');
    } finally {
      setIsClearing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-low border-l border-white/10 shadow-glass-hover p-6 flex flex-col justify-between backdrop-blur-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-glow">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-on-surface">Search History</h2>
                <p className="text-xs text-outline">Your recent weather queries</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-outline">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs">Loading search records...</span>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs">
                {error}
              </div>
            ) : historyItems.length === 0 ? (
              <EmptyState
                title="No search history yet"
                description="Your past weather lookups and date plans will appear here automatically."
                icon={Clock}
              />
            ) : (
              historyItems.map((item) => {
                const weather = item.weather_summary_json || {};
                const createdDate = new Date(item.created_at).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectCity?.(item.city_name);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-white/5 hover:border-primary/30 hover:bg-surface-container-high transition-all cursor-pointer group flex items-center justify-between shadow-specular-inset"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                          {item.city_name}
                        </span>
                        {item.requested_date && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-outline">
                            {item.requested_date}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-outline">
                        <Calendar className="w-3 h-3" />
                        <span>{createdDate}</span>
                      </div>
                    </div>

                    {weather.temp !== undefined && (
                      <div className="text-right">
                        <span className="font-display font-extrabold text-base text-on-surface font-tabular">
                          {weather.temp}°C
                        </span>
                        <p className="text-[10px] text-on-surface-variant">{weather.condition || 'Clear'}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {historyItems.length > 0 && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-outline">{historyItems.length} records</span>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                isLoading={isClearing}
                onClick={handleClearHistory}
                className="text-error hover:bg-error-container/20 hover:text-error"
              >
                Clear History
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
