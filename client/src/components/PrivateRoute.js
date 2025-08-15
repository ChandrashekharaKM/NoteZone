import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header'; // Import our new Header

// Helper functions to check session status
const isAuthenticated = () => localStorage.getItem('token') !== null;
const isAdmin = () => localStorage.getItem('role') === 'admin';

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // If not logged in, redirect to the auth page
    return <Navigate to="/auth" />;
  }

  // If logged in, render the layout with the header and the page content
  return (
    <div>
      <Header isAdmin={isAdmin()} />
      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

export default PrivateRoute;