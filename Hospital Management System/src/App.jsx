import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Auth } from '@/layouts';
import ProtectedRoute from './PrivateRoute';
import { AuthProvider } from './AuthProvider'; // Import the AuthProvider component

// Lazy load your components
const Home_Page = lazy(() => import('./pages/Main_Page/Home_Page'));
const Unauthorized = lazy(() => import('./pages/Main_Page/Unauthorized'));
const Login = lazy(() => import('./pages/auth/Login/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register/Register.jsx'));
const Logout = lazy(() => import('./pages/auth/Login/Logout.jsx'));

function App() {
  return (
    <AuthProvider> {/* Wrap your Routes with the AuthProvider */}
      <Suspense fallback={<div>Loading...</div>}> {/* Suspense component to show fallback UI while loading */}
        <Routes>
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/auth/*" element={<Auth />} />
          {/* <Route path="/homepage" element={<ProtectedRoute><Home_Page /></ProtectedRoute>} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
