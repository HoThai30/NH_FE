import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="container mt-8"><p className="text-center text-gray-700">Đang tải...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
