// src/pages/auth/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the token and username from sessionStorage
        // sessionStorage.removeItem('username');
        // sessionStorage.removeItem('token');
        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Logout;
