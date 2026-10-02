import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className,
  ...props
}) {
  const variants = {
    primary: 'bg-sky-50 text-sky-700 border-sky-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    indoor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    outdoor: 'bg-teal-50 text-teal-700 border-teal-200/80',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      <span>{children}</span>
    </span>
  );
}
