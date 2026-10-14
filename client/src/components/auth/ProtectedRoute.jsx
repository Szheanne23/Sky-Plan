import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="sky" />
        <p className="text-sm font-medium text-slate-500">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // In guest mode, accessing itineraries directs to the sign-up page
    if (location.pathname.startsWith('/itineraries')) {
      const search = location.search || '';
      return (
        <Navigate
          to={`/register?redirect=${encodeURIComponent(location.pathname + search)}`}
          state={{ from: location }}
          replace
        />
      );
    }
    // Redirect unauthenticated visitors to login, preserving target location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

