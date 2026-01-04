import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user=localStorage.getItem('user');
  // If no user or token, redirect to login
  if (token==null || user==null) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the children
  return children;
};

export default ProtectedRoute;
