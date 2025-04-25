// middleware/requestLogger.js

// Import the logger configuration to log the details of the requests
const logger = require('../config/logger');

/**
 * @desc    Logs details of incoming HTTP requests
 * @param   {Object} req - Request object
 * @param   {Object} res - Response object
 * @param   {Function} next - Next middleware function to pass control
 */
const requestLogger = (req, res, next) => {
  // Capture the start time to measure request duration
  const start = Date.now();
  
  // Log the basic request details: HTTP method, URL, and IP address
  const logMessage = `Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`;
  logger.info(logMessage);
  
  // Optionally log request headers for debugging or troubleshooting (can be verbose)
  logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);
  
  // Log response details once the response is sent
  res.on('finish', () => {
    // Calculate the duration it took to handle the request
    const duration = Date.now() - start;
    
    // Prepare the log message for the response
    const responseLog = `Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`;

    // If the status code indicates an error (4xx or 5xx), log it with a warning
    if (res.statusCode >= 400) {
      logger.warn(responseLog);
    } else {
      logger.info(responseLog);  // Otherwise, log it as a normal request
    }
  });
  
  // Pass control to the next middleware function
  next();
};

module.exports = requestLogger;
