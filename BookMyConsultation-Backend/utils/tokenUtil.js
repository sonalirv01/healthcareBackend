// Import jwt and define utilities for token operations.
// Create functions:
// - createToken: Generate a JWT for a user.
// - decodeToken: Decode a token without validating its signature.
// - verifyToken: Verify token validity and extract payload data.
// Export these functions for use in authMiddleware and services.

const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Function to create a JWT token
const createToken = (payload, options = {}) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: options.expiresIn || JWT_EXPIRES_IN,
      ...options,
    });
  } catch (error) {
    logger.error(`Error creating token: ${error.message}`);
    throw new Error('Failed to generate token');
  }
};

// Function to decode a JWT token without verifying its signature
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error(`Error decoding token: ${error.message}`);
    return null;
  }
};

// Function to verify a JWT token and extract its payload
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error(`Error verifying token: ${error.message}`);
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  createToken,
  decodeToken,
  verifyToken,
};