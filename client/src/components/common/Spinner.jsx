import React from 'react';
import { cn } from '../../lib/utils';

export default function Spinner({ size = 'md', color = 'sky', className }) {
  const sizes = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colors = {
    sky: 'border-sky-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
    slate: 'border-slate-600 border-t-transparent',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full animate-spin',
        sizes[size] || sizes.md,
        colors[color] || colors.sky,
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
