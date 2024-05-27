import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

export const AuthContext = createContext(); // Create a context for authentication

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
            console.log("Refresh token is active");
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            // Remove items from cookies
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            Cookies.remove('username');
            Cookies.remove('email');
            Cookies.remove('role');
            navigate('/login');
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

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
