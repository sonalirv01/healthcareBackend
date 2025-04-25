// models/address.js

// Import mongoose to define the schema and model for the address collection
const mongoose = require('mongoose');

// Define the address schema for the Address collection
const addressSchema = new mongoose.Schema({
  // Address line 1 (mandatory field)
  address: {
    type: String,
    required: [true, 'Address is required'], // Ensures address is provided
    trim: true // Removes leading/trailing spaces
  },
  // City (mandatory field)
  city: {
    type: String,
    required: [true, 'City is required'], // Ensures city is provided
    trim: true // Removes leading/trailing spaces
  },
  // State (mandatory field)
  state: {
    type: String,
    required: [true, 'State is required'], // Ensures state is provided
    trim: true // Removes leading/trailing spaces
  },
  // Pincode (mandatory, and must be numeric and 4 to 6 digits)
  pincode: {
    type: String,
    required: [true, 'Pincode is required'], // Ensures pincode is provided
    match: [/^\d{4,6}$/, 'Pincode must be numeric and 4 to 6 digits'] // Ensures the pincode is a number and is between 4 and 6 digits
  },
  // User ID reference (mandatory field, connects to the User model)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Creates a reference to the User model
    required: true // Ensures userId is provided
  }
}, { timestamps: true }); // Adds timestamps for createdAt and updatedAt fields

// Export the schema as a model for use in services
module.exports = mongoose.model('Address', addressSchema);
