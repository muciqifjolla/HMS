const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Route for handling login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        // If user not found, send error response
        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        // If password is incorrect, send error response
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // If user and password are correct, generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send token in response
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
