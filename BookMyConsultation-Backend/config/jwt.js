// Import jwt library for handling tokens.
// Create a function to generate JWT tokens using a secret key and payload.
// Define token expiration times as required (e.g., 1 hour).
// Add a function to verify tokens, ensuring they are valid and not expired.
// Handle invalid tokens gracefully by throwing appropriate errors.
// Export the helper functions for use in controllers and middleware.

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';

// Generate a JWT token for a given payload
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    throw new Error('Failed to generate token');
  }
};

// Decode a token without verifying its signature
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};