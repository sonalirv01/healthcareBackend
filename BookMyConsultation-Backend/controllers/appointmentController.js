// Import appointmentService to interact with appointment data.
// Example:
// - bookAppointment(req, res): Validate input and call service to create a new appointment.
// - getAppointments(req, res): Fetch user appointments from the database.
// Handle validation, authorization, and error responses.

const appointmentService = require('../services/appointmentService');
const { ValidationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// @desc Book a new appointment
const bookAppointment = async (req, res, next) => {
  try {
    const appointmentData = {
      ...req.body,
      userId: req.user.id,
    };

    const newAppointment = await appointmentService.createAppointment(appointmentData);
    res.status(201).json(newAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc Get appointments for logged-in user
const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentService.getAppointmentsByUser(userId);
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc Cancel an appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    
    const appointment = await appointmentService.cancelAppointment(appointmentId, userId);
    res.status(200).json({ 
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc Complete an appointment
const completeAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    
    const appointment = await appointmentService.getAppointmentById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to complete the appointment
    if (req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to complete this appointment');
    }
    
    const updated = await appointmentService.updateAppointmentStatus(appointmentId, 'completed');
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// Export the appointment controller functions
module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  completeAppointment,
};