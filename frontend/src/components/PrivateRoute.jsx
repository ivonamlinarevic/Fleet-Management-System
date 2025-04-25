import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Ako nije prijavljen, preusmjeren je na login
  }

  return children;
};

export default PrivateRoute;
