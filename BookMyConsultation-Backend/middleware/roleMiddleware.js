// middleware/checkRole.js

// Import AuthorizationError from the error handler module to handle authorization failures
const { AuthorizationError } = require('./errorHandler');

/**
 * @desc    Middleware to check if a user has the required role to access a resource
 * @param   {String} requiredRole - The role required to access the resource
 * @returns {Function} Middleware function to check user's role
 */
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user is authenticated by verifying if req.user exists
    if (!req.user) {
      // If the user is not authenticated, throw an AuthorizationError
      return next(new AuthorizationError('User not authenticated'));
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      // If the user's role does not match the required role, throw an AuthorizationError
      return next(new AuthorizationError(`This action requires ${requiredRole} privileges`));
    }

    // If the user has the required role, pass control to the next middleware
    next();
  };
};

module.exports = {
  checkRole
};
