const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/users/register
// @desc    Register new user
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user and return token
router.post('/login', loginUser);

// @route   GET /api/users/profile
// @desc    Get logged in user's profile
// @access  Protected
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;