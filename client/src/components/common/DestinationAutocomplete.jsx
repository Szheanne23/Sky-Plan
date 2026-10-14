import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Mountain,
  Palmtree,
  Waves,
  Landmark,
  Building2,
  Compass,
  Search,
  X,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';

/**
 * Curated database of Philippine destinations for Google Maps-style autocomplete recommendations.
 */
export const PHILIPPINE_DESTINATIONS = [
  {
    city: 'Baguio City',
    shortName: 'Baguio',
    province: 'Benguet',
    region: 'Cordillera Administrative Region (CAR)',
    category: 'Highland',
    highlight: '1,470m Cool Weather • Pine Trees',
    tag: 'Cool Highland (20°C)',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['baguio', 'benguet', 'cordillera', 'summer capital', 'pines', 'cool', 'cold', 'strawberries'],
  },
  {
    city: 'Siargao Island',
    shortName: 'Siargao',
    province: 'Surigao del Norte',
    region: 'Caraga Region',
    category: 'Island',
    highlight: 'Cloud 9 Surfing • Sugba Lagoon • Magpupungko',
    tag: 'Surfing Capital',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['siargao', 'surigao', 'cloud 9', 'surf', 'surfing', 'general luna', 'island'],
  },
  {
    city: 'Boracay',
    shortName: 'Boracay',
    province: 'Malay, Aklan',
    region: 'Western Visayas',
    category: 'Beach',
    highlight: 'White Sand Beach • Paraw Sailing • Nightlife',
    tag: 'World-Renowned Beach',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['boracay', 'aklan', 'malay', 'white beach', 'station 1', 'station 2', 'puka'],
  },
  {
    city: 'Palawan (El Nido)',
    shortName: 'El Nido',
    province: 'Northern Palawan',
    region: 'MIMAROPA',
    category: 'Island',
    highlight: 'Bacuit Bay Lagoons • Hidden Beaches • Limestone Karsts',
    tag: 'Turquoise Lagoons',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['palawan', 'el nido', 'bacuit', 'lagoons', 'island hopping', 'secret beach'],
  },
  {
    city: 'Coron',
    shortName: 'Coron',
    province: 'Calamian Islands, Palawan',
    region: 'MIMAROPA',
    category: 'Island',
    highlight: 'Kayangan Lake • Twin Lagoons • WWII Shipwreck Diving',
    tag: 'Wreck Diving & Lakes',
    icon: Waves,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['coron', 'palawan', 'kayangan', 'barracuda', 'diving', 'shipwreck'],
  },
  {
    city: 'Tagaytay',
    shortName: 'Tagaytay',
    province: 'Cavite',
    region: 'Calabarzon',
    category: 'Highland',
    highlight: 'Taal Lake & Volcano Ridge • Bulalo • Cool Breeze',
    tag: 'Scenic Ridge Getaway',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['tagaytay', 'cavite', 'taal', 'lake', 'volcano', 'ridge', 'bulalo', 'cool'],
  },
  {
    city: 'Manila',
    shortName: 'Manila',
    province: 'Metro Manila',
    region: 'National Capital Region (NCR)',
    category: 'Metro',
    highlight: 'Intramuros Historic Walled City • Baywalk • Museums',
    tag: 'Historic Capital',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['manila', 'metro manila', 'ncr', 'intramuros', 'makati', 'bgc', 'rizal park'],
  },
  {
    city: 'Cebu City',
    shortName: 'Cebu',
    province: 'Cebu',
    region: 'Central Visayas',
    category: 'Metro',
    highlight: 'Magellan’s Cross • Lechon • Gateway to Oslob & Kawasan',
    tag: 'Queen City of the South',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['cebu', 'cebu city', 'mactan', 'kawasan', 'oslob', 'moalboal'],
  },
  {
    city: 'Bohol (Panglao)',
    shortName: 'Bohol',
    province: 'Bohol',
    region: 'Central Visayas',
    category: 'Island',
    highlight: 'Chocolate Hills • Philippine Tarsiers • Alona Beach',
    tag: 'Nature & White Beach',
    icon: Compass,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['bohol', 'panglao', 'chocolate hills', 'tarsier', 'alona', 'loboc'],
  },
  {
    city: 'Batanes (Basco)',
    shortName: 'Batanes',
    province: 'Batanes',
    region: 'Cagayan Valley',
    category: 'Heritage',
    highlight: 'Marlboro Hills • Ivatan Stone Houses • Pacific Cliffs',
    tag: 'Pristine Northernmost Haven',
    icon: Landmark,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['batanes', 'basco', 'ivatan', 'marlboro hills', 'rolling hills', 'lighthouse'],
  },
  {
    city: 'Sagada',
    shortName: 'Sagada',
    province: 'Mountain Province',
    region: 'Cordillera Administrative Region (CAR)',
    category: 'Highland',
    highlight: 'Echo Valley Hanging Coffins • Sumaguing Cave • Kiltepan Peak',
    tag: 'Highland Mystique (19°C)',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['sagada', 'mountain province', 'hanging coffins', 'kiltepan', 'cave', 'caving'],
  },
  {
    city: 'La Union (San Juan)',
    shortName: 'La Union',
    province: 'La Union',
    region: 'Ilocos Region',
    category: 'Beach',
    highlight: 'Surfing Point • Tangadan Falls • Bohemian Sunset Cafes',
    tag: 'Surf & Cafe Culture',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['la union', 'elyu', 'san juan', 'surf', 'surfing', 'sunset', 'tangadan'],
  },
  {
    city: 'Vigan City',
    shortName: 'Vigan',
    province: 'Ilocos Sur',
    region: 'Ilocos Region',
    category: 'Heritage',
    highlight: 'Calle Crisologo Cobblestone • Kalesa • Empanada & Heritage',
    tag: 'UNESCO World Heritage',
    icon: Landmark,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['vigan', 'ilocos sur', 'calle crisologo', 'unesco', 'heritage', 'spanish colonial'],
  },
  {
    city: 'Davao City',
    shortName: 'Davao',
    province: 'Davao del Sur',
    region: 'Davao Region',
    category: 'Metro',
    highlight: 'Mount Apo Trekking • Philippine Eagle Center • Durian',
    tag: 'King of Fruits & Mt. Apo',
    icon: Building2,
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
    keywords: ['davao', 'davao city', 'mount apo', 'philippine eagle', 'durian', 'samal'],
  },
  {
    city: 'Iloilo City',
    shortName: 'Iloilo',
    province: 'Iloilo',
    region: 'Western Visayas',
    category: 'Heritage',
    highlight: 'City of Love • Spanish Plazas • La Paz Batchoy • Islas de Gigantes',
    tag: 'Heritage & Culinary',
    icon: Landmark,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['iloilo', 'iloilo city', 'batchoy', 'gigantes', 'miagao', 'heritage'],
  },
  {
    city: 'Puerto Princesa',
    shortName: 'Puerto Princesa',
    province: 'Palawan',
    region: 'MIMAROPA',
    category: 'Nature',
    highlight: 'Underground River UNESCO Wonder • Honda Bay Island Hopping',
    tag: 'Underground River Wonder',
    icon: Compass,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['puerto princesa', 'palawan', 'underground river', 'honda bay', 'sabang'],
  },
  {
    city: 'Dumaguete',
    shortName: 'Dumaguete',
    province: 'Negros Oriental',
    region: 'Central Visayas',
    category: 'Beach',
    highlight: 'City of Gentle People • Siliman Univ • Apo Island Sea Turtles',
    tag: 'Marine Sanctuary & Turtles',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['dumaguete', 'negros oriental', 'apo island', 'turtles', 'manjuyod'],
  },
  {
    city: 'Baler',
    shortName: 'Baler',
    province: 'Aurora',
    region: 'Central Luzon',
    category: 'Beach',
    highlight: 'Sabang Beach Pacific Surf • Millennium Tree • Dicasalarin Cove',
    tag: 'Birthplace of PH Surfing',
    icon: Waves,
    badgeColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
    keywords: ['baler', 'aurora', 'sabang', 'surf', 'surfing', 'dicasalarin'],
  },
  {
    city: 'Legazpi City',
    shortName: 'Legazpi',
    province: 'Albay',
    region: 'Bicol Region',
    category: 'Adventure',
    highlight: 'Mayon Volcano Perfect Cone • ATV Lava Trails • Cagsawa Ruins',
    tag: 'Mayon Volcano & ATV',
    icon: Mountain,
    badgeColor: 'text-primary bg-primary/10 border-primary/20',
    keywords: ['legazpi', 'albay', 'bicol', 'mayon', 'volcano', 'cagsawa', 'atv'],
  },
  {
    city: 'Camiguin Island',
    shortName: 'Camiguin',
    province: 'Camiguin',
    region: 'Northern Mindanao',
    category: 'Island',
    highlight: 'Island Born of Fire • White Island Sandbar • Sunken Cemetery',
    tag: 'Volcanic Island & Sandbars',
    icon: Palmtree,
    badgeColor: 'text-optimal bg-optimal/10 border-optimal/20',
    keywords: ['camiguin', 'white island', 'sunken cemetery', 'volcano', 'mantigue'],
  },
];

/**
 * Google Maps-Style Destination Autocomplete Input.
 *
 * Props:
 * - value: string (current input text)
 * - onChange: (cityName: string, destinationObj?: object) => void
 * - placeholder?: string
 * - label?: string
 * - required?: boolean
 * - id?: string
 * - className?: string
 * - onSelectDestination?: (dest: object) => void
 */
export default function DestinationAutocomplete({
  value = '',
  onChange,
  onSelectDestination,
  placeholder = 'Search Philippine destination or city (e.g. Baguio, Siargao, El Nido)...',
  label = 'Destination City',
  required = false,
  id = 'destination-autocomplete-input',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter recommendations based on query
  const cleanQuery = (query || '').toLowerCase().trim();

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
    : PHILIPPINE_DESTINATIONS; // Show all when empty / focused

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(val);
    }
  };

  const handleSelect = (dest) => {
    const cityName = dest.city;
    setQuery(cityName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(cityName, dest);
    }
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  const handleSelectCustom = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = filteredDestinations.length + (cleanQuery ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredDestinations.length) {
        handleSelect(filteredDestinations[highlightedIndex]);
      } else if (highlightedIndex === filteredDestinations.length && cleanQuery) {
        handleSelectCustom();
      } else if (filteredDestinations.length > 0) {
        handleSelect(filteredDestinations[0]);
      } else {
        handleSelectCustom();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setHighlightedIndex(-1);
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  // Helper to highlight matching text
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="font-semibold block mb-1 text-xs text-on-surface">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      {/* Input container with Google Maps pin & clear button */}
      <div className="relative flex items-center rounded-2xl bg-surface-container-high border border-white/10 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-specular-inset">
        <div className="pl-3.5 pr-1 flex items-center pointer-events-none text-primary">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full bg-transparent px-2 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Clear destination"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Google Maps Style Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-[340px] overflow-y-auto rounded-2xl bg-surface-container-low/95 backdrop-blur-2xl border border-white/15 shadow-2xl divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Indicator */}
          <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-outline font-medium bg-surface-container/60">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {cleanQuery
                ? `Matching destinations (${filteredDestinations.length})`
                : 'Recommended Philippine Destinations'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-outline/80">
              Google Maps Style
            </span>
          </div>

          {/* List of Destination Cards */}
          <div className="p-1 space-y-0.5">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((dest, index) => {
                const IconComponent = dest.icon || MapPin;
                const isSelected = highlightedIndex === index;
                const isExactActive = (value || '').toLowerCase() === dest.city.toLowerCase();

                return (
                  <button
                    key={dest.city}
                    type="button"
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group ${
                      isSelected
                        ? 'bg-surface-container-highest text-on-surface'
                        : 'hover:bg-surface-container/80 text-on-surface-variant'
                    } ${isExactActive ? 'border-l-2 border-primary bg-primary/5' : ''}`}
                  >
                    {/* Destination Icon Capsule */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        dest.badgeColor || 'bg-primary/10 text-primary border border-primary/20'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Location Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors truncate">
                          {highlightMatch(dest.city, cleanQuery)}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${dest.badgeColor} shrink-0 hidden sm:inline-block`}
                        >
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

                    {/* Arrow / Selection Indicator */}
                    <div className="self-center pl-1 text-outline/50 group-hover:text-primary transition-colors">
                      {isExactActive ? (
                        <Check className="w-4 h-4 text-optimal" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-outline space-y-1">
                <Compass className="w-6 h-6 mx-auto text-outline/60" />
                <p>No preset destinations found matching "{query}"</p>
              </div>
            )}

            {/* Custom Location fallback entry (like Google Maps "Search for ...") */}
            {cleanQuery && (
              <button
                type="button"
                onClick={handleSelectCustom}
                onMouseEnter={() => setHighlightedIndex(filteredDestinations.length)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border-t border-white/5 ${
                  highlightedIndex === filteredDestinations.length
                    ? 'bg-surface-container-highest text-primary'
                    : 'hover:bg-surface-container/60 text-outline'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-outline shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-on-surface">
                    Use custom location: <span className="text-primary font-bold">"{query}"</span>
                  </span>
                  <p className="text-[10px] text-outline">Press Enter or click to use this exact city name</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
