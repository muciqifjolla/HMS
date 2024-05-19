const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

    const JWT_SECRET = '03df719212d1d7a1f9b9930d0a7b161955ff9ba6d0c1509658bb8d204309ebb3';

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
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
      role: 'user' // Default role for new users
    });

    // Declare JWT_SECRET locally
    const JWT_SECRET = '03df719212d1d7a1f9b9930d0a7b161955ff9ba6d0c1509658bb8d204309ebb3';

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with success message and JWT token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { loginUser, registerUser };




// me dyjat