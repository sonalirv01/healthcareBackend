const express = require('express');
const router = express.Router();

const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  completeAppointment
} = require('../controllers/appointmentController');

const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// @route   POST /api/appointments
// @desc    Book an appointment
// @access  Protected
router.post('/', authMiddleware, bookAppointment);

// @route   GET /api/appointments
// @desc    Get user's appointments
// @access  Protected
router.get('/', authMiddleware, getAppointments);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Protected
router.put('/:id/cancel', authMiddleware, cancelAppointment);

// @route   PUT /api/appointments/:id/complete
// @desc    Mark appointment as completed (admin only)
// @access  Admin
router.put('/:id/complete', [authMiddleware, checkRole('admin')], completeAppointment);

module.exports = router;