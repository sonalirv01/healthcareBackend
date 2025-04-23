// Import jwt.verify to decode and validate JWT tokens.
// Create a middleware to check the Authorization header for a Bearer token.
// Decode the token, validate it, and attach user information to req.user.
// Respond with a 401 status if the token is missing or invalid.
// Export the middleware for use in routes.

const { verifyToken } = require('../utils/tokenUtil');
const { AuthenticationError } = require('./errorHandler');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authorization header missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode the token
    const decoded = verifyToken(token);

    // Attach user info to request object
    req.user = decoded;

    logger.debug(`Authenticated user: ${decoded.id}, role: ${decoded.role}`);
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};

module.exports = authMiddleware;