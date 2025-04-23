// Import necessary modules (e.g., mongoose for MongoDB).
// Define a function to establish a database connection using environment variables (e.g., MONGO_URI).
// Use try-catch for error handling to ensure database connection issues are logged and the process exits on failure.
// Export the database connection function for use in the server setup.

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;