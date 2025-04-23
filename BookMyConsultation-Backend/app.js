const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Import middleware
const requestLogger = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const testRoutes = require('./routes/testRoutes');
const addressRoutes = require('./routes/addressRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

// Security for HTTP headers
app.use(helmet());

// Middleware
app.use(bodyParser.json());

// Apply request logger middleware
app.use(requestLogger);

// Apply rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Routes
app.use('/api', testRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/', apiLimiter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler middleware
app.use(errorHandler);

module.exports = app;