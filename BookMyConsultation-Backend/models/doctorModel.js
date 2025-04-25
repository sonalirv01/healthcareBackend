// models/doctor.js

// Import mongoose to define the schema and model for doctors
const mongoose = require('mongoose');

// Define the doctor schema for the Doctor collection
const doctorSchema = new mongoose.Schema({
  // Doctor's name (required and trimmed)
  name: {
    type: String,
    required: true, // Ensures the name is provided
    trim: true // Removes leading/trailing spaces
  },
  // Doctor's specialization (required and trimmed)
  specialization: {
    type: String,
    required: true, // Ensures specialization is provided
    trim: true // Removes leading/trailing spaces
  },
  // Doctor's years of experience (required and non-negative)
  experience: {
    type: Number,
    required: true, // Ensures experience is provided
    min: 0 // Ensures experience is at least 0
  },
  // Doctor's date of birth (required)
  dob: {
    type: Date,
    required: true // Ensures dob is provided
  },
  // Doctor's email (required, must match a valid email format)
  email: {
    type: String,
    required: true, // Ensures email is provided
    trim: true, // Removes leading/trailing spaces
    match: [/.+@.+\..+/, 'Please enter a valid email'] // Validates email format
  },
  // Doctor's mobile number (required and must be exactly 10 digits)
  mobile: {
    type: String,
    required: true, // Ensures mobile number is provided
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'] // Validates mobile number format
  },
  // Doctor's availability status (defaults to true)
  availability: {
    type: Boolean,
    default: true // Defaults to true (available)
  },
  // Doctor's rating (between 0 and 5, default is 0)
  rating: {
    type: Number,
    min: 0, // Rating cannot be less than 0
    max: 5, // Rating cannot be more than 5
    default: 0 // Default rating is 0
  },
  // Reference to the address (required)
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address', // References the Address model
    required: true // Ensures an addressId is provided
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the schema as a model for use in services
module.exports = mongoose.model('Doctor', doctorSchema);
