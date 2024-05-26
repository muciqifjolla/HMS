require('dotenv').config();
const crypto = require('crypto');

const generateDynamicJwtToken = () => {
  const secretKey = crypto.randomBytes(64).toString('hex');
  return {
    secret: secretKey,
    algorithm: 'HS256'
  };
};

module.exports = generateDynamicJwtToken;
