// Start the Express server here.
// Import app.js and connect to the database.
// Read PORT from environment variables.
// Listen for incoming requests on the specified port.
// Log server start status using the logger.

// No, this is the first thing that has to be done, otherwise we get undefined for values in dotenv file
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
