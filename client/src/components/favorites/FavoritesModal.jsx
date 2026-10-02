import React, { useState, useEffect } from 'react';
import { Star, Trash2, X, MapPin, ExternalLink, RefreshCw, Compass } from 'lucide-react';
import favoritesService from '../../services/favoritesService';
import Button from '../common/Button';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

export default function FavoritesModal({ isOpen, onClose, onSelectCity }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load saved places.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen]);

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await favoritesService.removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to remove favorite.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-low border border-white/10 shadow-glass-hover p-6 z-10 backdrop-blur-2xl animate-in zoom-in-95 duration-150 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shadow-glow-amber">
              <Star className="w-5 h-5 fill-tertiary text-tertiary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-on-surface">Saved Destinations</h2>
              <p className="text-xs text-outline">Quick-access pinned cities stored in Supabase</p>
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

        {/* Content */}
        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-outline">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading saved places...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 text-error text-xs">
              {error}
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState
              title="No saved places yet"
              description="Click the star button on any city forecast to bookmark it here."
              icon={Star}
            />
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                onClick={() => {
                  onSelectCity?.(fav.city_name);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-white/5 hover:border-primary/30 hover:bg-surface-container-high transition-all cursor-pointer group flex items-center justify-between shadow-specular-inset"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      {fav.city_name}
                    </h3>
                    <p className="text-[11px] text-outline">{fav.country || 'Global Region'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, fav.id)}
                    disabled={deletingId === fav.id}
                    className="p-2 rounded-full hover:bg-error-container/20 text-outline hover:text-error transition-colors"
                    title="Remove from favorites"
                  >
                    {deletingId === fav.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-error" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-outline">
          <span>{favorites.length} destinations saved</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
