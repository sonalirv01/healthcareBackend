const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const {
  getDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Admin-only routes
router.post('/', [authMiddleware, checkRole('admin')], addDoctor);
router.put('/:id', [authMiddleware, checkRole('admin')], updateDoctor);
router.delete('/:id', [authMiddleware, checkRole('admin')], deleteDoctor);

module.exports = router;