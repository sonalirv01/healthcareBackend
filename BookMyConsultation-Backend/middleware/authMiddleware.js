// middleware/authMiddleware.js

// Middleware to authenticate requests using JWT
// - Checks for Bearer token in Authorization header
// - Decodes and verifies the token
// - Attaches user info to req.user
// - Throws AuthenticationError if token is missing/invalid

const { verifyToken } = require('../utils/tokenUtil');
const { AuthenticationError } = require('./errorHandler');
const logger = require('../config/logger');

/**
 * @desc    Middleware to authenticate user via JWT token
 * @access  Protected Routes
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authorization header missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode and validate the token
    const decoded = verifyToken(token);

    // Attach user info to request object for downstream access
    req.user = decoded;

    logger.debug(`Authenticated user: ${decoded.id}, role: ${decoded.role}`);
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};

module.exports = authMiddleware;
