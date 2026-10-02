import React, { useState } from 'react';
import { Search, MapPin, Calendar, Compass, Sparkles, Navigation } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '../../lib/utils';

/**
 * Stitch Weather Search Panel Component
 * Primary command input for selecting locations and forecast dates.
 */
export default function SearchPanel({
  onSearch,
  currentLocation = 'Interlaken, Switzerland',
  isLoading = false,
  className = '',
}) {
  const [query, setQuery] = useState(currentLocation);
  const [selectedDate, setSelectedDate] = useState('Today');

  const popularCities = [
    { name: 'Interlaken', temp: '19°C', icon: '⛅' },
    { name: 'Boulder', temp: '22°C', icon: '☀️' },
    { name: 'Kyoto', temp: '16°C', icon: '🌧️' },
    { name: 'Reykjavík', temp: '8°C', icon: '💨' },
    { name: 'Vancouver', temp: '17°C', icon: '⛅' },
    { name: 'Manila', temp: '31°C', icon: '☀️' },
    { name: 'Denver', temp: '20°C', icon: '☀️' },
  ];

  const dateOptions = ['Today', 'Tomorrow', 'This Weekend', '7-Day Overview'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch({ location: query.trim(), date: selectedDate });
    }
  };

  const handleCityClick = (city) => {
    setQuery(city.name);
    if (onSearch) {
      onSearch({ location: city.name, date: selectedDate });
    }
  };

  return (
    <div
      className={cn(
        'rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl p-4 sm:p-6 border border-white/10 shadow-glass space-y-4',
        className
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        {/* City Input Capsule */}
        <div className="relative flex-1 w-full rounded-full shadow-specular-inset">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state or coordinates... e.g. Interlaken, Denver, Tokyo"
            aria-label="Location search"
            className="block w-full border border-white/10 bg-surface-container-high/90 backdrop-blur-md rounded-full pl-11 pr-4 py-3 text-on-surface placeholder:text-outline text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 focus:shadow-[0_0_20px_rgba(76,214,251,0.25)]"
          />
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-full border border-white/5 overflow-x-auto max-w-full">
          {dateOptions.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
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

        {/* Search Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Search}
          isLoading={isLoading}
          className="w-full md:w-auto shrink-0"
        >
          Plan Activities
        </Button>
      </form>

      {/* Quick Location Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
        <span className="text-outline font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-primary" /> Popular:
        </span>
        <div className="flex items-center gap-1.5">
          {popularCities.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleCityClick(city)}
              className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high/70 hover:bg-surface-container-highest border border-white/10 hover:border-white/20 rounded-full font-tabular text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap active:scale-95 text-xs font-medium shadow-specular-inset"
            >
              <span>{city.name}</span>
              <span className="text-primary font-bold">{city.temp}</span>
              <span>{city.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
