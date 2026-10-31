import React, { useState, useEffect } from 'react';
import { Sparkles, Navigation, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { cn } from '../../lib/utils';
import DestinationAutocomplete from '../common/DestinationAutocomplete';
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
  const [selectedMeta, setSelectedMeta] = useState(null);

  const popularCities = [
    'Tokyo',
    'Paris',
    'New York',
    'Singapore',
    'Manila',
    'Baguio',
    'London',
    'Siargao',
    'Bali',
    'Boracay',
    'Seoul',
    'Cebu',
    'Sydney',
    'El Nido',
    'Rome',
    'Dubai',
    'Bohol',
    'Batanes',
    'Bangkok',
    'Barcelona',
  ];
  const dateOptions = ['Today', 'Tomorrow', 'This Weekend', '7-Day Overview'];

  useEffect(() => {
    setQuery(currentLocation);
  }, [currentLocation]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch && query.trim()) {
      const meta = selectedMeta && selectedMeta.city === query.trim() ? selectedMeta : {};
      onSearch({
        location: query.trim(),
        date: selectedDate,
        lat: meta.lat,
        lon: meta.lon,
        country: meta.country,
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onSearch && query.trim()) {
      const meta = selectedMeta && selectedMeta.city === query.trim() ? selectedMeta : {};
      onSearch({
        location: query.trim(),
        date,
        lat: meta.lat,
        lon: meta.lon,
        country: meta.country,
      });
    }
  };

  const handleCityClick = (cityName) => {
    setQuery(cityName);
    setSelectedMeta(null);
    if (onSearch) {
      onSearch({ location: cityName, date: selectedDate });
    }
  };

  const handleSelectRecommendation = (dest) => {
    const nextMeta = {
      city: dest.city,
      lat: dest.latitude,
      lon: dest.longitude,
      country: dest.country,
    };
    setQuery(dest.city);
    setSelectedMeta(nextMeta);
    if (onSearch) {
      onSearch({
        location: dest.city,
        date: selectedDate,
        lat: dest.latitude,
        lon: dest.longitude,
        country: dest.country,
      });
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl p-4 sm:p-6 border border-white/10 shadow-glass space-y-4',
        className
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* City Input Capsule with Google Maps Style Autocomplete */}
        <div className="flex-1 w-full">
          <DestinationAutocomplete
            value={query}
            onChange={(val, dest) => {
              setQuery(val);
              if (dest && (dest.latitude !== undefined || dest.country)) {
                setSelectedMeta({
                  city: val,
                  lat: dest.latitude,
                  lon: dest.longitude,
                  country: dest.country,
                });
              } else {
                setSelectedMeta(null);
              }
            }}
            onSelectDestination={handleSelectRecommendation}
            placeholder="Search any place in the world (city, town, island, landmark, country)..."
            label=""
            id="main-destination-search-input"
            className="w-full"
            roundedClassName="rounded-full"
            inputClassName="py-3 text-sm pl-2"
          />
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-2xl md:rounded-full border border-white/5 overflow-x-auto max-w-full py-1.5 px-2 scrollbar-none">
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
      <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs scrollbar-none">
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
