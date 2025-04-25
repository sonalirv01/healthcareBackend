// utils/jwtHelper.js

// Import jwt library for handling tokens
const jwt = require('jsonwebtoken');

// Retrieve the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Set the token expiration time to 30 minutes
const JWT_EXPIRES_IN = '30m'; // Token expires in 30 minutes

// Generate a JWT token for a given payload
const generateToken = (payload) => {
  try {
    // Sign and return the JWT token
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    // Throw an error if token generation fails
    throw new Error('Failed to generate token');
  }
};

// Verify the validity of a token
const verifyToken = (token) => {
  try {
    // Verify and decode the token, checking its validity and expiration
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Handle invalid or expired token errors
    throw new Error('Invalid or expired token');
  }
};

// Export the helper functions for use in controllers and middleware
module.exports = {
  generateToken,
  verifyToken
};
