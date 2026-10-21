import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify authenticated session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const token = localStorage.getItem('skyplan_token');
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      // Check if session has expired due to inactivity while the browser was closed
      try {
        const lastActivityStr = localStorage.getItem('skyplan_last_activity');
        if (lastActivityStr) {
          const lastActivity = Number(lastActivityStr);
          const customTimeout = Number(localStorage.getItem('skyplan_inactivity_timeout_ms'));
          const timeoutMs = (!isNaN(customTimeout) && customTimeout > 0) ? customTimeout : 15 * 60 * 1000;
          if (!isNaN(lastActivity) && (Date.now() - lastActivity >= timeoutMs)) {
            // Expired during browser closure
            localStorage.removeItem('skyplan_token');
            localStorage.removeItem('skyplan_last_activity');
            sessionStorage.setItem('skyplan_logout_reason', 'inactivity');
            if (isMounted) {
              setUser(null);
              setIsLoading(false);
            }
            return;
          }
        }
      } catch {
        // Ignore storage read error
      }

      // Safety timeout so session verification never hangs indefinitely
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      }, 3500);

      try {
        const response = await authService.getMe();
        if (isMounted && response?.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('skyplan_token');
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Logs in with email and password.
   */
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await authService.login({ email, password });
      if (response?.data?.user) {
        if (response.data.token) {
          localStorage.setItem('skyplan_token', response.data.token);
          localStorage.setItem('skyplan_last_activity', Date.now().toString());
        }
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      throw new Error('Invalid login response from server.');
    } catch (err) {
      const message = err.message || 'Failed to sign in. Please check your credentials.';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Registers a new account.
   */
  const register = async (email, password, displayName) => {
    setAuthError(null);
    try {
      const response = await authService.register({ email, password, displayName });
      if (response?.data?.user) {
        if (response.data.token) {
          localStorage.setItem('skyplan_token', response.data.token);
          localStorage.setItem('skyplan_last_activity', Date.now().toString());
        }
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      throw new Error('Invalid registration response from server.');
    } catch (err) {
      const message = err.message || 'Failed to create account.';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Logs out current session.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout request completed with warning:', err.message);
    } finally {
      localStorage.removeItem('skyplan_token');
      localStorage.removeItem('skyplan_last_activity');
      setUser(null);
      setAuthError(null);
    }
  };


  /**
   * Updates local user state (e.g. after editing profile).
   */
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
