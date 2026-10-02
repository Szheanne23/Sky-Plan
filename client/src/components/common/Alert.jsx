import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}) {
  const variants = {
    info: {
      container: 'bg-sky-50/90 border-sky-200 text-sky-900',
      icon: Info,
      iconColor: 'text-sky-600',
    },
    success: {
      container: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    warning: {
      container: 'bg-amber-50/90 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    error: {
      container: 'bg-rose-50/90 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
  };

  const current = variants[variant] || variants.info;
  const IconComponent = current.icon;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border p-4 flex gap-3 backdrop-blur-xs transition-all shadow-sm',
        current.container,
        className
      )}
      {...props}
    >
      <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', current.iconColor)} />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1 tracking-tight">{title}</h5>}
        <div className="leading-relaxed text-slate-700">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
