const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Middleware function to authorize user roles
const authenticateToken = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication token is missing authheader' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is missing' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;


    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
      }

       // Assuming the roles are stored in the token payload as 'role' (string) or 'roles' (array)
       const userRoles = decoded.roles || [decoded.role];

       const hasRequiredRole = role.some(role => userRoles.includes(role));
 
       if (hasRequiredRole) {
         req.user = decoded; // Add the decoded user information to the request object
         next();
       } else {
         return res.status(403).json({ message: 'Access Denied!' });
       }
    });
  };
};



module.exports = { authenticateToken};
