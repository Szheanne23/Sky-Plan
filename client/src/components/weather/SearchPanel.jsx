import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Compass, Sparkles, Navigation, X, ChevronRight, Check, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { cn } from '../../lib/utils';
import { PHILIPPINE_DESTINATIONS } from '../common/DestinationAutocomplete';
import { useAuth } from '../../context/AuthContext';

/**
 * Stitch Weather Search Panel Component
 * Primary command input for selecting locations and forecast dates with Google Maps-style recommendations.
 */
export default function SearchPanel({
  onSearch,
  currentLocation = 'Manila, Philippines',
  isLoading = false,
  className = '',
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState(currentLocation);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const popularCities = ['Manila', 'Baguio', 'Cebu', 'Tagaytay', 'Boracay', 'Siargao', 'Palawan', 'Davao'];
  const dateOptions = ['Today', 'Tomorrow', 'This Weekend', '7-Day Overview'];

  useEffect(() => {
    setQuery(currentLocation);
  }, [currentLocation]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = (query || '').toLowerCase().trim();

  // Filter recommendations
  const filteredDestinations = cleanQuery
    ? PHILIPPINE_DESTINATIONS.filter((dest) => {
        const matchesCity = dest.city.toLowerCase().includes(cleanQuery);
        const matchesShort = dest.shortName.toLowerCase().includes(cleanQuery);
        const matchesProvince = dest.province.toLowerCase().includes(cleanQuery);
        const matchesRegion = dest.region.toLowerCase().includes(cleanQuery);
        const matchesTag = dest.tag.toLowerCase().includes(cleanQuery);
        const matchesKeywords = dest.keywords.some((kw) => kw.includes(cleanQuery));
        return matchesCity || matchesShort || matchesProvince || matchesRegion || matchesTag || matchesKeywords;
      })
    : PHILIPPINE_DESTINATIONS.slice(0, 8); // Top recommendations when blank or default

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsDropdownOpen(false);
    if (onSearch && query.trim()) {
      onSearch({ location: query.trim(), date: selectedDate });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onSearch && query.trim()) {
      onSearch({ location: query.trim(), date });
    }
  };

  const handleCityClick = (cityName) => {
    setQuery(cityName);
    setIsDropdownOpen(false);
    if (onSearch) {
      onSearch({ location: cityName, date: selectedDate });
    }
  };

  const handleSelectRecommendation = (dest) => {
    setQuery(dest.city);
    setIsDropdownOpen(false);
    if (onSearch) {
      onSearch({ location: dest.city, date: selectedDate });
    }
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < filteredDestinations.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredDestinations.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredDestinations.length) {
        handleSelectRecommendation(filteredDestinations[highlightedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const highlightMatch = (text, q) => {
    if (!q || !text) return text;
    const index = text.toLowerCase().indexOf(q.toLowerCase());
    if (index === -1) return text;
    const before = text.substring(0, index);
    const match = text.substring(index, index + q.length);
    const after = text.substring(index + q.length);
    return (
      <>
        {before}
        <span className="text-primary font-bold underline decoration-primary/40 underline-offset-2">
          {match}
        </span>
        {after}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl p-4 sm:p-6 border border-white/10 shadow-glass space-y-4',
        className
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        {/* City Input Capsule with Google Maps Style Autocomplete */}
        <div className="relative flex-1 w-full rounded-full shadow-specular-inset">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Philippine city, province or destination... e.g. Manila, Baguio, Cebu, Siargao"
            aria-label="Location search"
            autoComplete="off"
            className="block w-full border border-white/10 bg-surface-container-high/90 backdrop-blur-md rounded-full pl-11 pr-10 py-3 text-on-surface placeholder:text-outline text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_20px_rgba(76,214,251,0.25)]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(true);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Autocomplete Recommendation Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-[320px] overflow-y-auto rounded-3xl bg-surface-container-low/95 backdrop-blur-2xl border border-white/15 shadow-2xl divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
              <div className="px-4 py-2.5 flex items-center justify-between text-[11px] text-outline font-medium bg-surface-container/60">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {cleanQuery ? 'Matching Philippine Destinations' : 'Recommended Destinations (Google Maps Style)'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-outline/80">
                  {filteredDestinations.length} found
                </span>
              </div>

              <div className="p-1.5 space-y-0.5">
                {filteredDestinations.map((dest, idx) => {
                  const IconComp = dest.icon || MapPin;
                  const isHighlighted = highlightedIndex === idx;

                  return (
                    <button
                      key={dest.city}
                      type="button"
                      onClick={() => handleSelectRecommendation(dest)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-start gap-3 group ${
                        isHighlighted
                          ? 'bg-surface-container-highest text-on-surface'
                          : 'hover:bg-surface-container/80 text-on-surface-variant'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${dest.badgeColor}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                            {highlightMatch(dest.city, cleanQuery)}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${dest.badgeColor} shrink-0 hidden sm:inline-block`}>
                            {dest.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-outline truncate mt-0.5">
                          {highlightMatch(`${dest.province}, ${dest.region}`, cleanQuery)}
                        </p>
                        <p className="text-[10px] text-tertiary truncate mt-0.5">
                          {dest.highlight}
                        </p>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-outline/50 group-hover:text-primary self-center transition-colors" />
                    </button>
                  );
                })}

                {cleanQuery && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border-t border-white/5 hover:bg-surface-container/60 text-outline"
                  >
                    <div className="w-8 h-8 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-outline shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-on-surface">
                        Search weather for: <span className="text-primary font-bold">"{query}"</span>
                      </span>
                      <p className="text-[10px] text-outline">Press Enter to check live forecast</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-full border border-white/5 overflow-x-auto max-w-full">
          {dateOptions.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => handleDateChange(date)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none',
                selectedDate === date
                  ? 'bg-primary-container text-on-primary-container shadow-glow'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              )}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Action Buttons: Plan Activities & Create Itinerary */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Sparkles}
            isLoading={isLoading}
            className="flex-1 md:flex-initial shadow-glow"
            title="Analyze weather and view tailored activity recommendations"
          >
            Plan Activities
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            icon={CalendarPlus}
            onClick={() => {
              const targetCity = query.trim() || 'Manila';
              const itineraryUrl = `/itineraries?city=${encodeURIComponent(targetCity)}&create=true`;
              if (!isAuthenticated) {
                navigate(`/register?redirect=${encodeURIComponent(itineraryUrl)}`);
                return;
              }
              navigate(itineraryUrl);
            }}
            className="flex-1 md:flex-initial whitespace-nowrap hover:border-primary hover:text-primary transition-all text-xs"
            title="Create an itinerary for this destination"
          >
            Add Itinerary
          </Button>
        </div>
      </form>

      {/* Quick Location Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
        <span className="text-outline font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-primary" /> Popular:
        </span>
        <div className="flex items-center gap-1.5">
          {popularCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleCityClick(city)}
              className="px-3.5 py-1 bg-surface-container-high/70 hover:bg-surface-container-highest border border-white/10 hover:border-primary/40 rounded-full text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap active:scale-95 text-xs font-medium shadow-specular-inset"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
