// middleware/errorHandler.js

// Import logger for detailed error logging
const logger = require('../config/logger');

// Custom error classes to handle specific types of errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Operational errors that we expect and handle
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types for better error handling and categorization
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400); // HTTP Status 400 for bad requests
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401); // HTTP Status 401 for unauthorized access
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized to access this resource') {
    super(message, 403); // HTTP Status 403 for forbidden access
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404); // HTTP Status 404 for not found errors
  }
}

class SlotUnavailableError extends AppError {
  constructor(message = 'The requested time slot is unavailable') {
    super(message, 400); // HTTP Status 400 for bad requests (time slot issues)
  }
}

// Global error handler middleware
/**
 * @desc    Handles errors from controllers or services
 * @param   {Object} err - Error object thrown by application
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @param   {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Default error status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details for monitoring and debugging
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Handle Mongoose validation errors (e.g., invalid input data)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return res.status(400).json({ status: 'fail', message });
  }

  // Handle MongoDB duplicate field errors (e.g., email already in use)
  if (err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({ status: 'fail', message });
  }

  // Handle operational errors (those expected in the application flow)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  
  // Handle unexpected programming errors (don't leak sensitive info)
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
