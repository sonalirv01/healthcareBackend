// Create middleware to log every incoming request.
// Log details such as HTTP method, URL, headers, and timestamp.
// Use the logger configured in logger.js to log these details.
// Pass control to the next middleware using next().

const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  const logMessage = `Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`;
  logger.info(logMessage);
  
  // Log request headers if needed (optional - can be verbose)
  logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);
  
  // After response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseLog = `Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`;
    
    if (res.statusCode >= 400) {
      logger.warn(responseLog);
    } else {
      logger.info(responseLog);
    }
  });
  
  next();
};

module.exports = requestLogger;