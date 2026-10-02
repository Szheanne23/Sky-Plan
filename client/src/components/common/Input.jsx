import React from 'react';
import { cn } from '../../lib/utils';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  pill = true,
  className,
  wrapperClassName,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full space-y-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative rounded-full shadow-specular-inset">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'block w-full border bg-surface-container-high/80 backdrop-blur-md text-on-surface placeholder:text-outline text-sm transition-all duration-200 focus:outline-none focus:ring-2',
            pill ? 'rounded-full' : 'rounded-xl',
            Icon ? 'pl-11 pr-4 py-2.5' : 'px-4 py-2.5',
            error
              ? 'border-error/50 focus:border-error focus:ring-error/20 text-error placeholder:text-error/50'
              : 'border-white/10 focus:border-primary focus:ring-primary/30 hover:border-white/20 focus:shadow-[0_0_16px_rgba(76,214,251,0.25)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-outline mt-1">{helperText}</p>}
    </div>
  );
}
