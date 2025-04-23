const mongoose = require('mongoose');
const { ValidationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

/**
 * Check if all required fields are present
 * @param {Object} data - The data object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @throws {ValidationError} - If any required field is missing
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @param {string} fieldName - The name of the field being validated (for error messages)
 * @throws {ValidationError} - If the ID is invalid
 */
const validateObjectId = (id, fieldName = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ${fieldName}`);
  }
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @throws {ValidationError} - If the email is invalid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @throws {ValidationError} - If the phone number is invalid
 */
const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new ValidationError('Phone number must be 10 digits');
  }
};

/**
 * Validate date - checks if date is valid and in the future if required
 * @param {string|Date} date - The date to validate
 * @param {boolean} futureOnly - Whether the date must be in the future
 * @throws {ValidationError} - If the date is invalid
 */
const validateDate = (date, futureOnly = false) => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj)) {
    throw new ValidationError('Invalid date format');
  }
  
  if (futureOnly && dateObj <= new Date()) {
    throw new ValidationError('Date must be in the future');
  }
};

/**
 * Validate appointment request
 * @param {Object} appointment - The appointment data to validate
 * @throws {ValidationError} - If the appointment data is invalid
 */
const validateAppointment = (appointment) => {
  validateRequiredFields(appointment, ['userId', 'doctorId', 'appointmentDate']);
  validateObjectId(appointment.userId, 'userId');
  validateObjectId(appointment.doctorId, 'doctorId');
  validateDate(appointment.appointmentDate, true);
};

/**
 * Validate user data
 * @param {Object} userData - The user data to validate
 * @throws {ValidationError} - If the user data is invalid
 */
const validateUser = (userData) => {
  validateRequiredFields(userData, ['firstName', 'lastName', 'mobile', 'emailId', 'password']);
  validateEmail(userData.emailId);
  validatePhone(userData.mobile);

  // Optional field - is not being sent by frontend so not required, but you can send it from postman
  if (userData.dob) {
    validateDate(userData.dob);
  }
  
  if (userData.password && userData.password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }
};

/**
 * Validate rating data
 * @param {Object} ratingData - The rating data to validate
 * @throws {ValidationError} - If the rating data is invalid
 */
const validateRating = (ratingData) => {
  validateRequiredFields(ratingData, ['userId', 'doctorId', 'rating']);
  validateObjectId(ratingData.userId, 'userId');
  validateObjectId(ratingData.doctorId, 'doctorId');
  
  const rating = Number(ratingData.rating);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be a number between 1 and 5');
  }
};

/**
 * Check for appointment slot availability
 * @param {Object} appointment - The appointment data to check
 * @param {Array} existingAppointments - Existing appointments to check against
 * @throws {SlotUnavailableError} - If the slot is unavailable
 */
const checkSlotAvailability = (appointment, existingAppointments) => {
  const { SlotUnavailableError } = require('../middleware/errorHandler');
  
  const appointmentDate = new Date(appointment.appointmentDate);
  const appointmentEnd = new Date(appointmentDate);
  appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30); // Assume 30-min appointments
  
  const conflictingAppointment = existingAppointments.find(existing => {
    const existingStart = new Date(existing.appointmentDate);
    const existingEnd = new Date(existingStart);
    existingEnd.setMinutes(existingEnd.getMinutes() + 30);
    
    return (
      (appointmentDate >= existingStart && appointmentDate < existingEnd) ||
      (appointmentEnd > existingStart && appointmentEnd <= existingEnd) ||
      (appointmentDate <= existingStart && appointmentEnd >= existingEnd)
    );
  });
  
  if (conflictingAppointment) {
    throw new SlotUnavailableError('This time slot is already booked');
  }
};

module.exports = {
  validateRequiredFields,
  validateObjectId,
  validateEmail,
  validatePhone,
  validateDate,
  validateAppointment,
  validateUser,
  validateRating,
  checkSlotAvailability
};