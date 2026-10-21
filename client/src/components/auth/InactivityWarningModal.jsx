import React from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

/**
 * Inactivity Warning Modal
 * Prompts the user with a countdown when their session is about to expire due to inactivity.
 */
export default function InactivityWarningModal({
  isOpen,
  secondsRemaining,
  totalWarningSeconds = 60,
  onStaySignedIn,
  onLogoutNow,
}) {
  if (!isOpen) return null;

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / totalWarningSeconds) * 100));
  
  // Format MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-container-low border border-caution/30 shadow-2xl p-6 sm:p-8 space-y-6 text-on-surface text-center overflow-hidden">
        {/* Specular Radial Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-caution/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-primary/15 blur-2xl pointer-events-none" />

        {/* Pulsing Warning Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-caution/15 border border-caution/30 flex items-center justify-center text-caution shadow-lg shadow-caution/10">
          <Clock className="w-8 h-8 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-caution animate-ping" />
        </div>

        {/* Title and Explanation */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-caution/15 border border-caution/30 text-caution text-[11px] font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Session Inactivity Notice</span>
          </div>

          <h2 id="inactivity-modal-title" className="font-display font-extrabold text-2xl text-on-surface tracking-tight">
            Are You Still There?
          </h2>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            For security and privacy, your active SkyPlan session will automatically expire and log out due to inactivity.
          </p>
        </div>

        {/* Countdown Display Capsule */}
        <div className="p-4 rounded-2xl bg-surface-container-high/80 border border-white/10 shadow-specular-inset space-y-2">
          <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
            Time Remaining
          </span>
          <div className="font-display font-black text-4xl sm:text-5xl text-caution font-tabular tracking-tight">
            {formattedTime}
          </div>

          {/* Linear countdown bar */}
          <div className="w-full bg-surface-container-highest/80 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-caution to-error h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={CheckCircle2}
            onClick={onStaySignedIn}
            className="w-full sm:flex-1 shadow-glow"
          >
            Stay Signed In
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            icon={LogOut}
            onClick={onLogoutNow}
            className="w-full sm:w-auto hover:border-error/50 hover:text-error"
          >
            Log Out Now
          </Button>
        </div>
      </div>
    </div>
  );
}
