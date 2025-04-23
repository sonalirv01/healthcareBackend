// Implement rating-related route handlers here.
// Example handlers:
// - getRatings: Fetch all ratings for a doctor.
// - addRating: Submit a new rating for a doctor.
// Validate inputs (e.g., rating should be within a valid range).

const ratingService = require('../services/ratingService');
const { ValidationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// @desc Get all ratings for a doctor
const getRatings = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const ratings = await ratingService.fetchRatingsForDoctor(doctorId);
    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

// @desc Add a new rating
const addRating = async (req, res, next) => {
  try {
    const { doctorId, appointmentId, rating, comments } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    const newRating = await ratingService.createRating({
      userId,
      doctorId,
      appointmentId,
      rating,
      comments,
    });

    res.status(201).json(newRating);
  } catch (error) {
    next(error);
  }
};

// @desc Get current user's submitted ratings
const getUserRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ratings = await ratingService.fetchRatingsByUser(userId);
    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRatings,
  addRating,
  getUserRatings
};