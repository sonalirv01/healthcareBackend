// controllers/userController.js

// Example handlers:
// - registerUser(req, res): Create a new user and return JWT
// - loginUser(req, res): Authenticate and return JWT
// - getUserProfile(req, res): Get current user's profile info

const userService = require('../services/userService');
const { generateToken } = require('../config/jwt');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return JWT token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { emailId, password } = req.body;
    const user = await userService.authenticateUser(emailId, password);
    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get profile of currently logged-in user
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Export controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
