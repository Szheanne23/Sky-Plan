import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({
  children,
  className,
  interactive = false,
  glass = true,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        glass
          ? 'bg-surface-container-low/80 backdrop-blur-xl border border-white/10 shadow-glass'
          : 'bg-surface-container border border-white/10 shadow-glass',
        interactive && 'hover:shadow-glass-hover hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-4 border-b border-white/5 relative z-10', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-bold font-display text-on-surface tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-on-surface-variant mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-6 relative z-10', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 bg-surface-container-lowest/50 rounded-b-2xl border-t border-white/5 flex items-center justify-between relative z-10', className)} {...props}>
      {children}
    </div>
  );
}
