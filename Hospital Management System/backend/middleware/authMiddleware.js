// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  console.log(authHeader);
  console.log("egzon")
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  const JWT_SECRET = '03df719212d1d7a1f9b9930d0a7b161955ff9ba6d0c1509658bb8d204309ebb3';

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired authentication token' });
    }
    // Attach the decoded payload to the request object for further use
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

module.exports = { authenticateToken, requireRole };
