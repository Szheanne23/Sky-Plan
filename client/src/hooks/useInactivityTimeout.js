import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Default inactivity timeout: 15 minutes (900,000 ms)
 * Default warning period: 60 seconds (60,000 ms)
 */
export const DEFAULT_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins
export const DEFAULT_WARNING_DURATION_MS = 60 * 1000; // 60 secs

/**
 * Custom hook to monitor user inactivity and trigger warning / auto-logout.
 * Supports cross-tab synchronization and customizable timeout for testing.
 */
export function useInactivityTimeout({
  isAuthenticated,
  onLogout,
  timeoutMs = DEFAULT_INACTIVITY_TIMEOUT_MS,
  warningDurationMs = DEFAULT_WARNING_DURATION_MS,
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.round(warningDurationMs / 1000));
  
  // Allow overriding timeout via window or localStorage for testing
  const getEffectiveTimeout = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.__SKYPLAN_INACTIVITY_TIMEOUT_MS) {
        return Number(window.__SKYPLAN_INACTIVITY_TIMEOUT_MS);
      }
      const stored = localStorage.getItem('skyplan_inactivity_timeout_ms');
      if (stored && !isNaN(Number(stored))) {
        return Number(stored);
      }
    }
    return timeoutMs;
  }, [timeoutMs]);

  const getEffectiveWarningDuration = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.__SKYPLAN_WARNING_DURATION_MS) {
        return Number(window.__SKYPLAN_WARNING_DURATION_MS);
      }
      const stored = localStorage.getItem('skyplan_warning_duration_ms');
      if (stored && !isNaN(Number(stored))) {
        return Number(stored);
      }
    }
    return warningDurationMs;
  }, [warningDurationMs]);

  const lastActivityRef = useRef(Date.now());
  const timerCheckIntervalRef = useRef(null);
  const logoutTriggeredRef = useRef(false);

  /**
   * Resets the inactivity timer to now.
   */
  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    logoutTriggeredRef.current = false;
    setShowWarning(false);
    
    const warnMs = getEffectiveWarningDuration();
    setSecondsRemaining(Math.round(warnMs / 1000));

    try {
      localStorage.setItem('skyplan_last_activity', now.toString());
    } catch {
      // Ignore localStorage write errors in private browsing
    }
  }, [getEffectiveWarningDuration]);

  // Handle activity events with throttling
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false);
      return;
    }

    const now = Date.now();
    const effTimeout = getEffectiveTimeout();
    const effWarning = getEffectiveWarningDuration();
    const warningThreshold = effTimeout - effWarning;

    let initialLastActivity = now;
    try {
      const stored = localStorage.getItem('skyplan_last_activity');
      if (stored) {
        const parsed = Number(stored);
        if (!isNaN(parsed) && parsed > 0) {
          initialLastActivity = parsed;
          lastActivityRef.current = parsed;
        }
      }
    } catch {
      // Ignore storage read error
    }

    const elapsedOnMount = now - initialLastActivity;
    if (elapsedOnMount >= effTimeout) {
      if (!logoutTriggeredRef.current) {
        logoutTriggeredRef.current = true;
        if (onLogout) {
          onLogout();
        }
      }
      return;
    } else if (elapsedOnMount >= warningThreshold) {
      setShowWarning(true);
      const remainingMs = Math.max(0, effTimeout - elapsedOnMount);
      setSecondsRemaining(Math.ceil(remainingMs / 1000));
    } else {
      // Still active, refresh timer
      resetTimer();
    }

    let throttleTimeout = null;
    const handleUserActivity = () => {
      // If warning modal is already showing, user must explicitly click "Stay Signed In" or interact
      if (showWarning) {
        return;
      }

      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
          lastActivityRef.current = Date.now();
          try {
            localStorage.setItem('skyplan_last_activity', Date.now().toString());
          } catch {
            // Ignore storage errors
          }
        }, 1500); // 1.5s throttle to keep CPU lean
      }
    };

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Cross-tab synchronization listener
    const handleStorageChange = (e) => {
      if (e.key === 'skyplan_last_activity' && e.newValue) {
        const remoteTime = Number(e.newValue);
        if (remoteTime > lastActivityRef.current) {
          lastActivityRef.current = remoteTime;
          setShowWarning(false);
          const warnMs = getEffectiveWarningDuration();
          setSecondsRemaining(Math.round(warnMs / 1000));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Periodic check interval (every 1 second)
    timerCheckIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const effTimeout = getEffectiveTimeout();
      const effWarning = getEffectiveWarningDuration();
      const warningThreshold = effTimeout - effWarning;

      let lastAct = lastActivityRef.current;
      try {
        const stored = localStorage.getItem('skyplan_last_activity');
        if (stored) {
          const storedNum = Number(stored);
          if (!isNaN(storedNum)) {
            lastAct = storedNum;
            lastActivityRef.current = storedNum;
          }
        }
      } catch {
        // Ignore storage read error
      }

      const elapsed = now - lastAct;

      if (elapsed >= effTimeout) {
        // Inactivity limit reached -> trigger automatic logout
        if (!logoutTriggeredRef.current) {
          logoutTriggeredRef.current = true;
          setShowWarning(false);
          if (onLogout) {
            onLogout();
          }
        }
      } else if (elapsed >= warningThreshold) {
        // Within warning window
        setShowWarning(true);
        const remainingMs = Math.max(0, effTimeout - elapsed);
        setSecondsRemaining(Math.ceil(remainingMs / 1000));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      if (timerCheckIntervalRef.current) {
        clearInterval(timerCheckIntervalRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [isAuthenticated, onLogout, resetTimer, showWarning, getEffectiveTimeout, getEffectiveWarningDuration]);

  return {
    showWarning,
    secondsRemaining,
    resetTimer,
  };
}
