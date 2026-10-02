import React from 'react';

/**
 * Reusable Stitch atmospheric pulse skeleton loader.
 */
export default function LoadingSkeleton({ className = '', variant = 'rectangle', count = 1 }) {
  const baseClasses = 'animate-pulse bg-surface-container-high/60 border border-white/5';

  const variantClasses = {
    text: 'h-4 rounded-md w-full',
    heading: 'h-8 rounded-lg w-3/4',
    avatar: 'w-10 h-10 rounded-full shrink-0',
    button: 'h-10 rounded-full w-28',
    card: 'h-48 rounded-2xl w-full',
    rectangle: 'h-24 rounded-xl w-full',
  };

  const selectedClass = variantClasses[variant] || variantClasses.rectangle;

  if (count === 1) {
    return <div className={`${baseClasses} ${selectedClass} ${className}`} aria-hidden="true" />;
  }

  return (
    <div className="space-y-3 w-full" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`${baseClasses} ${selectedClass} ${className}`} />
      ))}
    </div>
  );
}
