const Appointment = require('../models/appointmentModel');
const { validateAppointment, checkSlotAvailability, validateObjectId } = require('../utils/validationUtil');
const { ValidationError, SlotUnavailableError, NotFoundError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Creates a new appointment for a user with a specific doctor and date
const createAppointment = async ({ userId, doctorId, appointmentDate, notes }) => {
  try {
    // Validate appointment data
    validateAppointment({ userId, doctorId, appointmentDate });
    
    // Check for conflicting appointments
    const existingAppointments = await Appointment.find({
      doctorId,
      status: 'booked',
      appointmentDate: {
        $gte: new Date(new Date(appointmentDate).setHours(0, 0, 0)),
        $lt: new Date(new Date(appointmentDate).setHours(23, 59, 59))
      }
    });
    
    checkSlotAvailability({ appointmentDate }, existingAppointments);
    
    const appointment = new Appointment({
      userId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      notes,
    });

    await appointment.save();
    logger.info(`New appointment created: ${appointment._id}`);
    return appointment;
  } catch (error) {
    logger.error(`Appointment creation failed: ${error.message}`);
    throw error;
  }
};

// Retrieves all appointments for a specific user, sorted by appointment date
const getAppointmentsByUser = async (userId) => {
  try {
    validateObjectId(userId, 'userId');
    
    const appointments = await Appointment.find({ userId })
      .populate('doctorId', 'name specialization')
      .sort({ appointmentDate: 1 });
      
    logger.info(`Retrieved ${appointments.length} appointments for user ${userId}`);
    return appointments;
  } catch (error) {
    logger.error(`Failed to get appointments for user ${userId}: ${error.message}`);
    throw error;
  }
};

// Get appointment by ID  
const getAppointmentById = async (id) => {
  try {
    validateObjectId(id, 'appointmentId');
    return await Appointment.findById(id);
  } catch (error) {
    throw error;
  }
};

// Cancel an appointment
const cancelAppointment = async (appointmentId, userId) => {
  try {
    validateObjectId(appointmentId, 'appointmentId');
    validateObjectId(userId, 'userId');
    
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    
    if (!appointment) {
      throw new NotFoundError('Appointment not found or does not belong to this user');
    }
    
    if (appointment.status === 'cancelled') {
      throw new ValidationError('Appointment is already cancelled');
    }
    
    // Check if appointment is in the past
    if (new Date(appointment.appointmentDate) < new Date()) {
      throw new ValidationError('Cannot cancel past appointments');
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    logger.info(`Appointment ${appointmentId} cancelled by user ${userId}`);
    return appointment;
  } catch (error) {
    logger.error(`Failed to cancel appointment ${appointmentId}: ${error.message}`);
    throw error;
  }
};

// Update appointment status
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    validateObjectId(appointmentId, 'appointmentId');
    
    if (!['booked', 'completed', 'cancelled'].includes(status)) {
      throw new ValidationError('Invalid appointment status');
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }
    
    logger.info(`Appointment ${appointmentId} status updated to ${status}`);
    return appointment;
  } catch (error) {
    logger.error(`Failed to update appointment status: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  cancelAppointment,
  getAppointmentById,
  updateAppointmentStatus
};