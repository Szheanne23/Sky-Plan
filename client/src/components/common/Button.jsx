import React from 'react';
import { cn } from '../../lib/utils';
import Spinner from './Spinner';

/**
 * Reusable Button Component adhering to Google Stitch UI specifications.
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm hover:shadow-glow focus:ring-sky-500 border border-sky-500/30',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-900 border border-slate-800',
    outline: 'bg-white/60 backdrop-blur-xs hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm focus:ring-sky-500',
    ghost: 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm focus:ring-rose-500 border border-rose-500/30',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
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
