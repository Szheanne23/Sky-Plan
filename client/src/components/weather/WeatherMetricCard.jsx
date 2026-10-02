import React from 'react';
import Badge from '../common/Badge';
import { cn } from '../../lib/utils';

/**
 * Stitch Micro-Telemetry Metric Card
 * Displays meteorological telemetry with rich visual hierarchy.
 */
export default function WeatherMetricCard({
  title,
  value,
  unit = '',
  description,
  icon: Icon,
  badgeText,
  badgeVariant = 'primary',
  progress,
  className = '',
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-container-low/70 backdrop-blur-md p-4 flex flex-col justify-between border border-white/5 hover:border-white/15 hover:bg-surface-container/80 transition-all duration-200 group shadow-specular-inset',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-outline font-display">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-full bg-surface-container-high/80 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="my-1">
        <div className="flex items-baseline gap-1">
          <span className="font-display font-extrabold text-2xl text-on-surface tracking-tight font-tabular">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-on-surface-variant">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-2 w-full bg-surface-container-highest/60 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-secondary-container h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {badgeText && (
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
          <Badge variant={badgeVariant} size="sm">
            {badgeText}
          </Badge>
        </div>
      )}
    </div>
  );
}
