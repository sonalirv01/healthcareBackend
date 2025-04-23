// Import bcrypt for hashing sensitive data like passwords.
// Create functions:
// - hashPassword: Salt and hash a plain text password.
// - comparePasswords: Verify a password against a hashed value.
// Export these utilities for use in user authentication.

const bcrypt = require('bcrypt');
const logger = require('../config/logger');

/**
 * Hash a password
 * @param {string} password - The plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} - The hashed password
 */

const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error(`Error hashing password: ${error.message}`);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
const comparePasswords = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error(`Error comparing passwords: ${error.message}`);
    throw new Error('Password comparison failed');
  }
};

module.exports = {
  hashPassword,
  comparePasswords
};