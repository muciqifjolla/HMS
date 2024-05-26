const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Route for handling registration
router.post('/register', async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        // Validate required fields
        if (!email || !username || !password || !role) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        // Find user by email
        const existingUser = await User.findOne({ where: { email } });

        // If user already exists, send error response
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            email,
            username,           
            password: hashedPassword,
            role, 
        });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message and JWT token
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
