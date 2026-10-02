import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  pulse = false,
  className,
  ...props
}) {
  const variants = {
    primary: 'bg-primary-container/20 text-primary border-primary/30 shadow-specular-inset',
    secondary: 'bg-secondary-container/20 text-secondary border-secondary/30 shadow-specular-inset',
    tertiary: 'bg-tertiary-container/20 text-tertiary border-tertiary/40 shadow-specular-inset',
    success: 'bg-optimal/15 text-optimal border-optimal/40 shadow-specular-inset',
    optimal: 'bg-optimal/15 text-optimal border-optimal/40 shadow-specular-inset',
    warning: 'bg-caution/15 text-caution border-caution/40 shadow-specular-inset',
    caution: 'bg-caution/15 text-caution border-caution/40 shadow-specular-inset',
    danger: 'bg-error-container/30 text-error border-error/40 shadow-specular-inset',
    neutral: 'bg-surface-container-high/90 text-on-surface-variant border-white/10 shadow-specular-inset',
    indoor: 'bg-azure/15 text-secondary border-azure/35 shadow-specular-inset',
    outdoor: 'bg-optimal/15 text-optimal border-optimal/35 shadow-specular-inset',
  };

  const pulseColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    tertiary: 'bg-tertiary',
    success: 'bg-optimal',
    optimal: 'bg-optimal',
    warning: 'bg-caution',
    caution: 'bg-caution',
    danger: 'bg-error',
    neutral: 'bg-outline',
    indoor: 'bg-secondary',
    outdoor: 'bg-optimal',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1 font-bold uppercase tracking-wider',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', pulseColors[variant] || 'bg-primary')} />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', pulseColors[variant] || 'bg-primary')} />
        </span>
      )}
      {Icon && <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      <span>{children}</span>
    </span>
  );
}
