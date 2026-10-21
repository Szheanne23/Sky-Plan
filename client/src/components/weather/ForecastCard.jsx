import React from 'react';
import { Droplets } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Stitch 7-Day Forecast Card
 * Scannable daily cards with high/low temperature bar and active state.
 */
export default function ForecastCard({
  day,
  date,
  condition,
  icon: Icon,
  highTemp,
  lowTemp,
  precipChance = 0,
  isSelected = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'snap-start shrink-0 flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 text-center min-w-[105px] sm:min-w-[125px] flex-1 border select-none focus:outline-none focus:ring-2 focus:ring-primary',
        isSelected
          ? 'bg-gradient-to-b from-surface-container-high/90 to-surface-container-low/90 border-primary/40 shadow-glow'
          : 'bg-surface-container-low/60 hover:bg-surface-container-high/60 border-white/5 hover:border-white/15',
        className
      )}
    >
      <div className="space-y-0.5 mb-2">
        <span className="block font-display font-bold text-xs uppercase tracking-wider text-on-surface">
          {day}
        </span>
        <span className="block text-[11px] text-outline font-medium">{date}</span>
      </div>

      <div className="my-2 flex flex-col items-center">
        {Icon && (
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center mb-1 transition-transform',
              isSelected ? 'bg-primary-container/30 text-primary scale-110' : 'bg-white/5 text-on-surface'
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <span className="text-xs text-on-surface-variant font-medium line-clamp-1 max-w-[100px]">
          {condition}
        </span>
      </div>

      {/* Temperature High/Low Display */}
      <div className="w-full mt-2 pt-2 border-t border-white/5 space-y-1">
        <div className="flex items-center justify-between text-xs font-tabular font-bold">
          <span className="text-tertiary">{highTemp}°</span>
          <span className="text-outline font-normal">{lowTemp}°</span>
        </div>

        {/* Visual Mini Temperature Range Bar */}
        <div className="w-full bg-surface-container-highest/60 rounded-full h-1 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-tertiary h-full rounded-full w-4/5 mx-auto" />
        </div>

        {precipChance > 0 && (
          <div className="flex items-center justify-center gap-1 text-[10px] text-primary font-medium pt-0.5">
            <Droplets className="w-2.5 h-2.5" />
            <span>{precipChance}%</span>
          </div>
        )}
      </div>
    </button>
  );
}
