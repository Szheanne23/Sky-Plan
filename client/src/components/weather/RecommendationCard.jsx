import React from 'react';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Home, 
  Compass,
  CalendarPlus 
} from 'lucide-react';
import Badge from '../common/Badge';
import { cn } from '../../lib/utils';
import { getDestinationMedia } from '../../services/destinationMediaService';

/**
 * Stitch Smart Activity Recommendation Card
 * Displays activity suggestion with suitability status, rationale, and condition requirements.
 */
export default function RecommendationCard({
  title,
  category = 'OUTDOOR',
  suitability = 'OPTIMAL', // OPTIMAL | SUITABLE | CAUTION | UNFAVORABLE | INDOOR_ALT
  suitabilityScore = 95,
  rationale,
  timeSlot = '09:00 - 13:00',
  conditions = [],
  icon: Icon = Compass,
  imageUrl,
  destination,
  onAddToItinerary,
  className = '',
}) {
  const suitabilityConfig = {
    OPTIMAL: {
      badge: 'optimal',
      label: 'Optimal Conditions',
      accentBorder: 'border-optimal/40',
      glow: 'shadow-glow-optimal',
      indicatorIcon: CheckCircle2,
      scoreColor: 'text-optimal',
    },
    SUITABLE: {
      badge: 'primary',
      label: 'Suitable',
      accentBorder: 'border-primary/40',
      glow: 'shadow-glow',
      indicatorIcon: CheckCircle2,
      scoreColor: 'text-primary',
    },
    CAUTION: {
      badge: 'caution',
      label: 'Weather Dependent',
      accentBorder: 'border-caution/40',
      glow: 'shadow-glow-amber',
      indicatorIcon: AlertTriangle,
      scoreColor: 'text-caution',
    },
    UNFAVORABLE: {
      badge: 'danger',
      label: 'Unfavorable',
      accentBorder: 'border-error/40',
      glow: 'shadow-none',
      indicatorIcon: XCircle,
      scoreColor: 'text-error',
    },
    INDOOR_ALT: {
      badge: 'indoor',
      label: 'Indoor Alternative',
      accentBorder: 'border-purple-400/40',
      glow: 'shadow-[0_0_16px_rgba(168,85,247,0.25)]',
      indicatorIcon: Home,
      scoreColor: 'text-purple-400',
    },
  };

  const currentConfig = suitabilityConfig[suitability] || suitabilityConfig.SUITABLE;
  const IndicatorIcon = currentConfig.indicatorIcon;

  // Resolve matching authentic destination photo
  const destinationMedia = getDestinationMedia(destination);
  const displayImage = imageUrl || destinationMedia?.imageUrl;

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-container-low/70 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between border border-white/10 hover:border-white/25 hover:bg-surface-container/80 transition-all duration-300 group shadow-specular-inset overflow-hidden',
        currentConfig.accentBorder,
        className
      )}
    >
      <div>
        {/* Activity Photo Header */}
        {displayImage && (
          <div className="relative w-full h-40 -mt-1 -mx-0 mb-3.5 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/30 transition-all shadow-md bg-surface-container">
            <img
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                if (destinationMedia?.imageUrl && e.target.src !== destinationMedia.imageUrl) {
                  e.target.src = destinationMedia.imageUrl;
                } else {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/20 to-transparent pointer-events-none" />
            {destination && (
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
                  <MapPin className="w-2.5 h-2.5 text-primary" /> {destination}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Header: Activity Icon + Category Badge + Suitability Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high/90 border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
              <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-on-surface leading-tight">
                {title}
              </h4>
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1 mt-0.5">
                {category === 'INDOOR' ? (
                  <>
                    <Home className="w-3 h-3 text-purple-400" /> Indoor Activity
                  </>
                ) : (
                  <>
                    <Compass className="w-3 h-3 text-primary" /> Outdoor Recreation
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className={cn('font-display font-extrabold text-lg font-tabular', currentConfig.scoreColor)}>
              {suitabilityScore}%
            </div>
            <span className="text-[10px] text-outline font-semibold uppercase tracking-wider">Score</span>
          </div>
        </div>

        {/* Suitability Banner */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={currentConfig.badge} size="sm" pulse={suitability === 'OPTIMAL'}>
            <IndicatorIcon className="w-3 h-3 mr-1" />
            {currentConfig.label}
          </Badge>

          {timeSlot && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-outline bg-surface-container-high/60 px-2.5 py-0.5 rounded-full border border-white/5 font-tabular">
              <Clock className="w-3 h-3 text-tertiary" />
              {timeSlot}
            </span>
          )}
        </div>

        {/* Meteorological Rationale */}
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed mb-4">
          {rationale}
        </p>
      </div>

      {/* Footer / Conditions & Add to Itinerary Action */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {conditions.slice(0, 2).map((cond, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-container-high/60 text-outline border border-white/5 font-tabular truncate max-w-[140px]"
            >
              {cond}
            </span>
          ))}
        </div>
        {onAddToItinerary && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToItinerary();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-[11px] font-semibold transition-all active:scale-95 shadow-specular-inset shrink-0"
            title="Save to Itinerary"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Add Itinerary</span>
          </button>
        )}
      </div>
    </div>
  );
}
