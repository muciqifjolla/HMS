const crypto = require('crypto');

const generateRandomToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = generateRandomToken;
