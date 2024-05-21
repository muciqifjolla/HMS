import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth } from '@/layouts';
import Home_Page from './pages/Main_Page/Home_Page';
import Login from './pages/auth/Login/Login.jsx';
import Register from './pages/auth/Register/Register.jsx';
import Logout from './pages/auth/Login/Logout.jsx';
import ProtectedRoute from './PrivateRoute';
import { AuthProvider } from './AuthProvider'; // Import the AuthProvider component

function App() {
  return (
    <AuthProvider> {/* Wrap your Routes with the AuthProvider */}
      <Routes>
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/auth/*" element={<Auth />} />
        {/* <Route path="/homepage" element={<ProtectedRoute><Home_Page /></ProtectedRoute>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
