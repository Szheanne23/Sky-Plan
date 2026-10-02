import React from 'react';
import { cn } from '../../lib/utils';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className,
  wrapperClassName,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full space-y-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'block w-full rounded-xl border bg-white/70 backdrop-blur-xs text-slate-900 placeholder:text-slate-400 sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2',
            Icon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-200/90 focus:border-sky-500 focus:ring-sky-500/20 hover:border-slate-300',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
}
