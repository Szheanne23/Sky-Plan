import React from 'react';
import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', color = 'primary', className }) {
  const sizes = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colors = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
    secondary: 'border-secondary border-t-transparent',
    tertiary: 'border-tertiary border-t-transparent',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full animate-spin',
        sizes[size] || sizes.md,
        colors[color] || colors.primary,
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
