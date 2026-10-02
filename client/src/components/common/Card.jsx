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
        'rounded-2xl transition-all duration-300',
        glass
          ? 'bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-glass'
          : 'bg-white border border-slate-200 shadow-sm',
        interactive && 'hover:shadow-glass-hover hover:border-sky-300/80 hover:-translate-y-0.5 cursor-pointer',
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
    <div className={cn('px-6 pt-6 pb-4 border-b border-slate-100/80', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
