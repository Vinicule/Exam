import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuthContext();

  if (user) {
    // If user is logged in, redirect from public pages (like login) to home
    return <Navigate to="/" replace />;
  }

  // If user is not logged in, render the public page
  return children;
};

export default PublicRoute;