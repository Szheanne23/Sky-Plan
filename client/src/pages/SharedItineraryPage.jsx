import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Compass, 
  Check, 
  Copy, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  User, 
  CloudSun,
  Layers,
  ArrowRight
} from 'lucide-react';
import itineraryService from '../services/itineraryService';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function SharedItineraryPage() {
  const { shareCode } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadShared() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await itineraryService.getSharedItinerary(shareCode);
        setItinerary(data.itinerary);
        setActivities(data.activities || []);
      } catch (err) {
        setError(err.message || 'Shared itinerary not found or the link has expired.');
      } finally {
        setIsLoading(false);
      }
    }

    if (shareCode) {
      loadShared();
    }
  }, [shareCode]);

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <LoadingSkeleton variant="rectangle" count={4} />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-error-container/20 text-error flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-on-surface">Shared Itinerary Not Found</h2>
        <p className="text-xs text-outline leading-relaxed">
          {error || 'This itinerary may have been removed or made private by its creator.'}
        </p>
        <Link to="/">
          <Button variant="primary" size="md">
            Go to SkyPlan Homepage
          </Button>
        </Link>
      </div>
    );
  }

  const dateStr = itinerary.start_date || itinerary.end_date
    ? `${itinerary.start_date ? new Date(itinerary.start_date).toLocaleDateString() : 'Flexible'} ${
        itinerary.end_date ? `– ${new Date(itinerary.end_date).toLocaleDateString()}` : ''
      }`
    : 'Flexible Dates';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl border border-white/10 shadow-glass space-y-5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider font-tabular">
              {itinerary.occasion || 'Shared Trip'}
            </span>
            <span className="text-xs text-outline flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {itinerary.destination_city}
              {itinerary.country_code && ` (${itinerary.country_code})`}
            </span>
          </div>

          <button
            type="button"
            onClick={copyPageLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-white/10 text-xs font-semibold text-on-surface transition-all active:scale-95 shadow-specular-inset"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-optimal" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Itinerary'}</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-on-surface tracking-tight">
            {itinerary.title}
          </h1>
          <p className="text-xs sm:text-sm text-outline flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-tertiary" />
            <span>{dateStr}</span>
            <span>•</span>
            <User className="w-4 h-4 text-primary" />
            <span>Curated by {itinerary.creator_name || 'SkyPlan Traveler'}</span>
          </p>
        </div>

        {itinerary.description && (
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pt-2 border-t border-white/5">
            {itinerary.description}
          </p>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-on-surface flex items-center gap-2">
            <span>Trip Schedule & Timeline</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-outline">
              {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'}
            </span>
          </h2>

          <Link
            to={`/?city=${encodeURIComponent(itinerary.destination_city)}`}
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <span>Live Weather in {itinerary.destination_city}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-low text-center text-outline text-xs">
            No specific activities scheduled yet.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-surface-container-low/70 border border-white/10 shadow-glass flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold text-xs shrink-0 font-tabular">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-base text-on-surface">
                      {act.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-outline text-[11px] font-medium font-tabular">
                      {act.time_slot || 'Morning'}
                    </span>
                    <Badge
                      variant={
                        act.category === 'INDOOR'
                          ? 'indoor'
                          : act.suitability === 'OPTIMAL'
                          ? 'optimal'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {act.category}
                    </Badge>
                  </div>

                  {act.notes && (
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      {act.notes}
                    </p>
                  )}

                  {act.location_name && (
                    <p className="text-[11px] text-outline flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-tertiary" />
                      <span>{act.location_name}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-surface-container-high to-surface-container border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-lg text-on-surface">
            Inspired by this itinerary?
          </h3>
          <p className="text-xs text-outline">
            Plan your own weather-optimized holiday with live forecasts and smart recommendations.
          </p>
        </div>

        <Link to={`/?city=${encodeURIComponent(itinerary.destination_city)}`}>
          <Button variant="primary" size="md" icon={ArrowRight}>
            Plan Your Trip to {itinerary.destination_city}
          </Button>
        </Link>
      </div>
    </div>
  );
}
