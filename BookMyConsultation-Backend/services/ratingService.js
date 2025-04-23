const Rating = require('../models/ratingModel');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Fetch all ratings for a doctor
const fetchRatingsForDoctor = async (doctorId) => {
  try {
    return await Rating.find({ doctorId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });
  } catch (error) {
    logger.error(`Error fetching ratings: ${error.message}`);
    throw error;
  }
};

// Fetch all ratings by a user
const fetchRatingsByUser = async (userId) => {
  try {
    return await Rating.find({ userId })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'appointmentDate')
      .sort({ createdAt: -1 });
  } catch (error) {
    logger.error(`Error fetching user ratings: ${error.message}`);
    throw error;
  }
};

// Create a new rating for a doctor
const createRating = async ({ userId, doctorId, appointmentId, rating, comments }) => {
  try {
    // Validate input
    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      userId, 
      doctorId,
      status: { $in: ['booked', 'completed'] } //For now I just made it so it doesn't require to be completed
    });
    
    if (!appointment) {
      throw new ValidationError('Cannot rate: appointment not found or not completed');
    }
    
    // Check if the user has already rated this appointment
    const existingRating = await Rating.findOne({ appointmentId });
    if (existingRating) {
      throw new ValidationError('You have already rated this appointment');
    }
    
    // Validate rating value
    const newRating = new Rating({ 
      userId, 
      doctorId, 
      appointmentId, 
      rating, 
      comments 
    });
    
    await newRating.save();
    logger.info(`New rating created for doctor ${doctorId} by user ${userId}`);
    
    return newRating;
  } catch (error) {
    logger.error(`Rating creation failed: ${error.message}`);
    throw error;
  }
};

// Update the doctor's average rating based on all ratings
const updateDoctorRating = async (doctorId) => {
  try {
    const ratings = await Rating.find({ doctorId });
    
    if (ratings.length === 0) {
      await Doctor.findByIdAndUpdate(doctorId, { rating: 0 });
      return 0;
    }
    
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / ratings.length;
    const roundedRating = Math.round(avgRating * 10) / 10;
    
    await Doctor.findByIdAndUpdate(doctorId, { rating: roundedRating });
    logger.info(`Updated rating for doctor ${doctorId}: ${roundedRating}`);
    
    return roundedRating;
  } catch (error) {
    logger.error(`Failed to update doctor rating: ${error.message}`);
    throw error;
  }
};

module.exports = {
  fetchRatingsForDoctor,
  createRating,
  updateDoctorRating,
  fetchRatingsByUser
};