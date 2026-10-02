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
      container: 'bg-primary-container/15 border-primary/30 text-on-surface shadow-specular-inset',
      icon: Info,
      iconColor: 'text-primary',
    },
    success: {
      container: 'bg-optimal/15 border-optimal/30 text-on-surface shadow-specular-inset',
      icon: CheckCircle2,
      iconColor: 'text-optimal',
    },
    warning: {
      container: 'bg-caution/15 border-caution/30 text-on-surface shadow-specular-inset',
      icon: AlertTriangle,
      iconColor: 'text-caution',
    },
    error: {
      container: 'bg-error-container/30 border-error/40 text-on-surface shadow-specular-inset',
      icon: AlertCircle,
      iconColor: 'text-error',
    },
  };

  const current = variants[variant] || variants.info;
  const IconComponent = current.icon;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border p-4 flex gap-3 backdrop-blur-md transition-all shadow-glass',
        current.container,
        className
      )}
      {...props}
    >
      <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', current.iconColor)} />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-bold text-on-surface mb-0.5 tracking-tight font-display">{title}</h5>}
        <div className="leading-relaxed text-on-surface-variant text-xs">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-outline hover:text-on-surface rounded-lg p-1 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
