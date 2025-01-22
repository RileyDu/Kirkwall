import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

const RedirectBasedOnAuth = () => {
  const { currentUser } = useAuth();

  // If the user is not logged in, redirect to '/'
  if (!currentUser || !currentUser.email) {
    return <Navigate to="/" />;
  }

  // If the user is logged in, redirect to '/dashboard'
  return <Navigate to="/dashboard" />;
};

export default RedirectBasedOnAuth;
