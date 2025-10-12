import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // Check if user is authenticated
  if (!isAuthenticated || !user.id) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is admin (double verification)
  // 1. Check stored admin flag
  // 2. Verify username matches admin pattern (additional security)
  const isAdminVerified = isAdmin && user.username === 'Admin';
  
  if (!isAdminVerified) {
    // Redirect non-admin users to their dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default AdminRoute;