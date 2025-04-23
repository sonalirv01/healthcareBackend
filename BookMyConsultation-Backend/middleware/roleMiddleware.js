const { AuthorizationError } = require('./errorHandler');

// Middleware to check if user has the required role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('User not authenticated'));
    }

    if (req.user.role !== requiredRole) {
      return next(new AuthorizationError(`This action requires ${requiredRole} privileges`));
    }

    next();
  };
};

module.exports = {
  checkRole
};