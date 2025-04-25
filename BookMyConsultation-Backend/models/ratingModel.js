// models/rating.js

// Import mongoose to define the schema and model for ratings
const mongoose = require('mongoose');

// Define the rating schema for the Rating collection
const ratingSchema = new mongoose.Schema({
  // Reference to the Appointment model (required and unique)
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true, // Ensures appointmentId is provided
    unique: true // Ensures appointmentId is unique
  },
  // Reference to the Doctor model (required)
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true // Ensures doctorId is provided
  },
  // Reference to the User model (required)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Ensures userId is provided
  },
  // Rating value (required and between 1 and 5)
  rating: {
    type: Number,
    required: true, // Ensures rating is provided
    min: [1, 'Minimum rating is 1'], // Validates minimum rating is 1
    max: [5, 'Maximum rating is 5'] // Validates maximum rating is 5
  },
  // Optional comments for the rating (trimmed)
  comments: {
    type: String,
    trim: true // Removes leading/trailing spaces from comments
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Post-save hook to update doctor’s rating after saving a rating document
ratingSchema.post('save', async function() {
  try {
    const { updateDoctorRating } = require('../services/ratingService');
    await updateDoctorRating(this.doctorId); // Updates the doctor's rating after a new rating is saved
  } catch (err) {
    console.error('Error updating doctor rating:', err); // Log error if updating fails
  }
});

// Post-delete hook to update doctor's rating after deleting a rating document
ratingSchema.post('deleteOne', { document: true, query: false }, async function() {
  try {
    const { updateDoctorRating } = require('../services/ratingService');
    await updateDoctorRating(this.doctorId); // Updates the doctor’s rating after deleting a rating
  } catch (err) {
    console.error('Error updating doctor rating after delete:', err); // Log error if updating fails
  }
});

// Export the schema as a model for use in services
module.exports = mongoose.model('Rating', ratingSchema);
