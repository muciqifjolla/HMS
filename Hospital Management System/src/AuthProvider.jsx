import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

export const AuthContext = createContext(); // Create a context for authentication

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the pop-up
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const storedToken = Cookies.get('token'); // Get token from cookies
      if (storedToken) {
        try {
          const response = await Axios.get('http://localhost:9004/api/expiration', {
            headers: { Authorization: `Bearer ${storedToken}` } // Ensure your backend is setup to receive Bearer token
          });
          const { data } = response;
          if (data.message === 'Refresh token is active') {
            // console.log("Refresh token is active");
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            // Remove items from cookies
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('role');
            setShowPopup(true); // Show pop-up
            setTimeout(() => {
              setShowPopup(false); // Hide pop-up after 2 seconds
              navigate('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking token expiration:', error);
          window.location.reload(); // Consider more graceful fallback
          setIsLoggedIn(false);
          navigate('/login');
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token && location.pathname === '/login') {
      navigate('/dashboard/home'); // Redirect to dashboard if logged in and trying to access login page
    }
  }, [location, navigate]);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
      {showPopup && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
          Session expired. Redirecting to login...
        </div>
      )}
    </AuthContext.Provider>
  );
};