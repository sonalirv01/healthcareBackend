const express = require('express');
const router = express.Router();

const {
  getRatings,
  addRating,
  getUserRatings
} = require('../controllers/ratingController');

const authMiddleware = require('../middleware/authMiddleware');

// @route GET /api/ratings/doctor/:doctorId
// @desc Get all ratings for a specific doctor
router.get('/doctor/:doctorId', getRatings);

// @route GET /api/ratings/user
// @desc Get all ratings by the logged-in user
router.get('/user', authMiddleware, getUserRatings);

// @route POST /api/ratings
// @desc Add a new rating
router.post('/', authMiddleware, addRating);

module.exports = router;