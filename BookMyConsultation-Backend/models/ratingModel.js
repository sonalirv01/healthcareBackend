const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5']
  },
  comments: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Ensure that the appointmentId is unique
ratingSchema.post('save', async function() {
  try {
    const { updateDoctorRating } = require('../services/ratingService');
    await updateDoctorRating(this.doctorId);
  } catch (err) {
    console.error('Error updating doctor rating:', err);
  }
});

// After updating a rating, update the doctor's average rating
ratingSchema.post('deleteOne', { document: true, query: false }, async function() {
  try {
    const { updateDoctorRating } = require('../services/ratingService');
    await updateDoctorRating(this.doctorId);
  } catch (err) {
    console.error('Error updating doctor rating after delete:', err);
  }
});

module.exports = mongoose.model('Rating', ratingSchema);