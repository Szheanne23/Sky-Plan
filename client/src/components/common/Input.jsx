import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={cn('w-full space-y-1.5', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-display"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-full shadow-specular-inset">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            'block w-full border bg-surface-container-high/80 backdrop-blur-md text-on-surface placeholder:text-outline text-sm transition-all duration-200 focus:outline-none focus:ring-2',
            pill ? 'rounded-full' : 'rounded-xl',
            Icon ? 'pl-11' : 'pl-4',
            isPasswordField ? 'pr-11 py-2.5' : 'pr-4 py-2.5',
            error
              ? 'border-error/50 focus:border-error focus:ring-error/20 text-on-surface placeholder:text-error/50'
              : 'border-white/10 focus:border-primary focus:ring-primary/30 hover:border-white/20 focus:shadow-[0_0_16px_rgba(76,214,251,0.25)]',
            className
          )}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            tabIndex={0}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error font-medium mt-1 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-outline mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
