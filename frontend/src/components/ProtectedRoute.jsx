import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isAuthenticated || !user.id) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;