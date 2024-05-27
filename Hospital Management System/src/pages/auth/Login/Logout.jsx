// src/pages/auth/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {

        navigate('/login');
    }, [navigate]);

    return null;
};

export default Logout;
