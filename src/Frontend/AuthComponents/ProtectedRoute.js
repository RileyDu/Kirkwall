import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

const ProtectedRoute = ({ children, allowedUsers = [], redirectPaths = {} }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/landing" />;
  }

  // Check if the current user is allowed to access this route
  if (allowedUsers.length > 0 && !allowedUsers.includes(currentUser.email)) {
    // Check redirect paths for specific users
    if (redirectPaths[currentUser.email]) {
      return <Navigate to={redirectPaths[currentUser.email]} />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
