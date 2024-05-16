// controllers/AuthController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
    try {
      // Extract login credentials from the request body
      const { username, password } = req.body;
  
      // Find the user in the database by username
      const user = await User.findOne({ where: { username } });
  
      // If user does not exist, return an error
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If passwords do not match, return an error
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      // If username and password are correct, generate a JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      // Send the JWT token back to the client as a response
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const registerUser = async (req, res) => {
  try {
    // Extract registration data from the request body
    const { email, username, password, fullName, phone } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database with the provided role
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      fullName,
      phone,
      role: 'user' // Default role for new users
    });

    // Generate JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success message and JWT token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { loginUser, registerUser };
