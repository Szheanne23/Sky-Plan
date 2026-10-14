import React from 'react';
import { cn } from '../../lib/utils';
import Spinner from './Spinner';

/**
 * Reusable Button Component conforming to Google Stitch Pill Action Specifications.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] shadow-specular-inset';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-glow hover:shadow-glow focus:ring-primary border border-white/20 font-semibold dark:from-sky-500 dark:to-blue-600',
    secondary: 'bg-surface-container-high/90 hover:bg-surface-container-highest text-on-surface border border-outline-variant/30 hover:border-outline-variant/50 focus:ring-primary',
    outline: 'bg-surface-container/60 hover:bg-surface-container-high text-on-surface border border-outline-variant/50 hover:border-primary/50 backdrop-blur-md focus:ring-primary',
    ghost: 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface focus:ring-outline shadow-none',
    danger: 'bg-error-container/40 hover:bg-error-container/60 text-error border border-error/30 focus:ring-error shadow-none',
    caution: 'bg-tertiary-container/20 hover:bg-tertiary-container/30 text-tertiary border border-tertiary/40 focus:ring-tertiary shadow-glow-amber',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-5 py-2.5 gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 'sm' : 'md'} color={variant === 'outline' || variant === 'ghost' ? 'current' : 'white'} />
      ) : Icon ? (
        <Icon className={cn(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
