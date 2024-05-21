import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

export const AuthContext = createContext(); // Create a context for authentication

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await Axios.get('http://localhost:9004/api/expiration');
          const { data } = response;
          if (data.message === 'Refresh token is active') {
            console.log("Refresh token is active");
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('email');
            navigate('/login');
          }
        } catch (error) {
          console.error('Error checking token expiration:', error);
          window.location.reload();
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
