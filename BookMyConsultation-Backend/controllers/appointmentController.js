// controllers/appointmentController.js

const appointmentService = require('../services/appointmentService');
const { AuthorizationError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
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

/**
 * @desc    Get all appointments for the logged-in user
 * @route   GET /api/appointments
 * @access  Private
 */
const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentService.getAppointmentsByUser(userId);
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booked appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const appointment = await appointmentService.cancelAppointment(appointmentId, userId);

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark an appointment as completed (admin only)
 * @route   PUT /api/appointments/:id/complete
 * @access  Admin
 */
const completeAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await appointmentService.getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to complete this appointment');
    }

    const updated = await appointmentService.updateAppointmentStatus(appointmentId, 'completed');
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  completeAppointment,
};
