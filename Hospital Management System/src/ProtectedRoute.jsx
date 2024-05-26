import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles = [], userRole }) => {

  console.log("userRole", userRole);
  console.log("allowedRoles", allowedRoles);
  if (allowedRoles.includes(userRole)) {
    return element;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
