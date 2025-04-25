// config/logger.js

// Import winston or another logging library
const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  // Add timestamp for each log
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Define custom log format including timestamp, log level, and message
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  // Set the logging level based on the environment variable, default to 'info'
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat, // Use the custom log format defined above
  transports: [
    // Console transport for development (colored output)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  // Add colors to log levels in the console
        logFormat                  // Use the custom log format
      )
    }),
    // File transport for error logs (logs errors only)
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'  // Log only 'error' level logs to this file
    }),
    // File transport for all combined logs (logs all levels)
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log')  // Stores all log levels
    })
  ]
});

// Export the logger instance for use across the project
module.exports = logger;
