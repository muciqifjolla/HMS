// Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the token from sessionStorage
        sessionStorage.removeItem('token');
        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Logout;
