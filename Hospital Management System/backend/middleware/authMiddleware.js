const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired authentication token' });
    }
    req.user = decoded;
    next();
  });
};

// Middleware function to authorize user roles
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  };
};



module.exports = { authenticateToken, requireRole};
