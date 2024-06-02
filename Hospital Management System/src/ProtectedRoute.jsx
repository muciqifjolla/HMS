import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles = [], userRole }) => {

  if (allowedRoles.includes(userRole)) {
    return element;
  } else {
    return <Navigate to="/dashboard/home" />;
  }
};

export default ProtectedRoute;