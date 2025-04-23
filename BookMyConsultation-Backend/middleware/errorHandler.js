// Create an error-handling middleware that catches exceptions from controllers or services.
// Format errors into a consistent JSON structure (e.g., { message, statusCode }).
// Use the res object to send appropriate HTTP status codes and messages.
// Ensure it's the last middleware in app.js.

const logger = require('../config/logger');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message || 'Authentication failed', 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message || 'Not authorized to access this resource', 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource not found', 404);
  }
}

class SlotUnavailableError extends AppError {
  constructor(message) {
    super(message || 'The requested time slot is unavailable', 400);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return res.status(400).json({ status: 'fail', message });
  }
  
  // Handle duplicate field value in MongoDB
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({ status: 'fail', message });
  }

  // Send error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  
  // For programming or unknown errors: don't leak error details
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  SlotUnavailableError
};