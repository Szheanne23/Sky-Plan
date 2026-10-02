import React from 'react';
import { Compass, Sparkles, FolderOpen, AlertCircle } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Stitch-styled EmptyState component.
 * Communicates what the section is for and provides a clear next action.
 */
export default function EmptyState({
  icon: Icon = Compass,
  title = 'No records found',
  description = 'There are currently no items to display in this view.',
  actionLabel,
  onAction,
  actionIcon,
  variant = 'default',
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-surface-container-low/50 border border-dashed border-outline-variant/40 backdrop-blur-md ${className}`}
      role="status"
    >
      <div className="w-14 h-14 rounded-full bg-surface-container-high/80 border border-white/10 flex items-center justify-center text-primary shadow-glow mb-4">
        <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
      </div>

      <h3 className="font-display font-bold text-lg text-on-surface mb-1.5">{title}</h3>
      <p className="font-body text-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
