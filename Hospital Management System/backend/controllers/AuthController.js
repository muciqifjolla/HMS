require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const generateRandomToken = require('../tokenUtils'); // Import the utility function
const generateDynamicJwtToken = require('../JWTUtils');  // Import the utility function
// const { setExpirationTimer } = require('../tokenExpiration'); // Import the shared module

const parseExpirationString = (expirationString) => {
    const value = parseInt(expirationString);
    const unit = expirationString.slice(-1);
    switch (unit) {
        case 's':
            return value * 1000; // Convert seconds to milliseconds
        case 'm':
            return value * 60 * 1000; // Convert minutes to milliseconds
        case 'h':
            return value * 60 * 60 * 1000; // Convert hours to milliseconds
        case 'd':
            return value * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        default:
            throw new Error('Invalid expiration string format');
    }
};

let refreshTokenExpirationTimer = null;
const setExpirationTimer = (expirationString, user) => {
    const expiresIn = parseExpirationString(expirationString); // Convert expiration string to milliseconds
    if (refreshTokenExpirationTimer) {
        clearTimeout(refreshTokenExpirationTimer.timer);
    }
    const expirationTime = Date.now() + expiresIn;
    refreshTokenExpirationTimer = {
        timer: setTimeout(() => {
            console.log(`Refresh token expired for user: ${user.username}`);
            refreshTokenExpirationTimer = null;
        }, expiresIn),
        expirationTime
    };
};

let jwtExpirationTimer = null;

const setJwtExpirationTimer = (expirationString, user) => {
    const expiresIn = parseExpirationString(expirationString); // Convert expiration string to milliseconds
    if (jwtExpirationTimer) {
        clearTimeout(jwtExpirationTimer.timer);
    }
    const expirationTime = Date.now() + expiresIn;
    jwtExpirationTimer = {
        timer: setTimeout(() => {
            console.log(`JWT token expired for user: ${user.username}`);
            jwtExpirationTimer = null;
        }, expiresIn),
        expirationTime
    };
};

// Configure Nodemailer using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Add this line to allow self-signed certificates
    }
});
const generateJWTToken = (user) => {
    const { secret, algorithm } = generateDynamicJwtToken();

    setJwtExpirationTimer('2h', user);

    // Adding more data to the JWT payload
    return jwt.sign(
    {
        user_id: user.user_id,
        username: user.username,
        email: user.email
    },
    secret, // Now using the dynamically generated secret
    { algorithm } // Using the dynamically generated algorithm
);
};
// Function to generate a refresh token using a random string
const generateRefreshToken = (user) => {
    const { secret, algorithm } = generateRandomToken();

    setExpirationTimer('7d', user);

    return jwt.sign(
        { user_id: user.user_id },
        secret, // Now using the dynamically generated secret
        { algorithm } // Using the dynamically generated algorithm
    );
};


const getExpirationTime = () => {
    if (!refreshTokenExpirationTimer) return null;
    if (Date.now() >= refreshTokenExpirationTimer.expirationTime) {
        refreshTokenExpirationTimer = null;
        return null;
    }
    return refreshTokenExpirationTimer.expirationTime;
};
const getExpirationTimeJWT = () => {
    if (!jwtExpirationTimer) return null;
    if (Date.now() >= jwtExpirationTimer.expirationTime) {
        jwtExpirationTimer = null;
        return null;
    }
    return jwtExpirationTimer.expirationTime;
};
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user.user_id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const token1 = generateJWTToken(user);
        
        // Generate refresh token
        const refreshToken = generateRefreshToken(user);

        // Print refresh token to console
        console.log('Refresh Token:', refreshToken);

        res.status(200).json({ token, token1, refreshToken, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const registerUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        console.log(req.body);

        // Validate required fields
        if (!email || !username || !password ) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        // Validate username length
        if (username.length < 2) {
            return res.status(400).json({ message: 'Username must be at least 2 characters long' });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z-]+\.[a-z]{3}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password complexity
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()\-_=+`~{}\[\]|\\:;"'<>,.?\/]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
        }

        // Check if user already exists with the same email
        const existingUserWithEmail = await User.findOne({ where: { email } });
        if (existingUserWithEmail) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if user already exists with the same username
        const existingUserWithUsername = await User.findOne({ where: { username } });
        if (existingUserWithUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role, // Default role for new users
        });

        // Generate JWT token
        // const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const token = generateJWTToken(newUser);
        // Send welcome email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Welcome to the Hospital Management System',
            text: `Dear ${username},

Welcome to the LIFELINE Hospital! We are delighted to have you as a part of our community. Our system is designed to streamline hospital operations, improve patient care, and enhance communication within the healthcare environment.

Your registration is now complete, and you can start exploring the features and services we offer.

If you have any questions or need assistance, please do not hesitate to contact our support team.

Thank you for joining us!

Best regards,
LIFELINE Hospital Team`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // Respond with success message and JWT token
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = { loginUser, registerUser, setExpirationTimer, getExpirationTime, setJwtExpirationTimer, getExpirationTimeJWT};
