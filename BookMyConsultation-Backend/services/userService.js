const User = require('../models/userModel');
const { validateUser } = require('../utils/validationUtil');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Handles user-related operations such as creating a new user
const createUser = async ({ firstName, lastName, dob, mobile, emailId, password, role }) => {
  try {
    // Validate user data
    validateUser({ firstName, lastName, dob, mobile, emailId, password, role });
    
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      throw new ValidationError('User already exists with this email');
    }
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      dob,
      mobile,
      emailId,
      password,
      role: role || 'user'
    });
    
    await user.save();
    logger.info(`New user created: ${user._id}`);

    // Return user data without the password
    const { password: _, ...userData } = user.toObject();
    return userData;
  } catch (error) {
    logger.error(`User creation failed: ${error.message}`);
    throw error;
  }
};

// Handles user authentication by checking email and password
const authenticateUser = async (emailId, password) => {
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ValidationError('Invalid email or password');
    }

    logger.info(`User authenticated: ${user._id}`);
    const { password: _, ...userData } = user.toObject();
    return userData;
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    throw error;
  }
};

// Retrieves user information by user ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    logger.error(`Failed to get user ${userId}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
};