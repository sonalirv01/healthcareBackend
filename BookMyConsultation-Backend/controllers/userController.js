// Implement user-related route handlers here.
// Example handlers:
// - registerUser: Create a new user.
// - loginUser: Authenticate a user and generate a JWT token.
// - getUserProfile: Fetch user profile details.
// Use the userService for database logic and password hashing utilities.

const userService = require('../services/userService');
const { generateToken } = require('../config/jwt');

// @desc Register a new user
const registerUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const token = generateToken({ id: user._id, role: user.role });
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

// @desc Login user and generate JWT token
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

// @desc Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error); 
  }
};

// Export the user controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};