import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-10 h-10 border-4 border-[#fa7830] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Verifying staff credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/staff-login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user.role === 'superadmin' || allowedRoles.includes(user.role);
    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 max-w-md text-center text-white">
            <h2 className="text-xl font-bold text-rose-400 font-heading">Access Restricted</h2>
            <p className="text-xs text-slate-300 mt-2">
              Your account role (<strong>{user.role}</strong>) does not have permission to view this administrative module.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
