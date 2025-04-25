// controllers/doctorController.js

const doctorService = require('../services/doctorService');

/**
 * @desc    Get all doctors or filter by specialization
 * @route   GET /api/doctors?specialization=xyz
 * @access  Public
 */
const getDoctors = async (req, res, next) => {
  try {
    const { specialization } = req.query;
    const doctors = await doctorService.fetchDoctors(specialization);
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new doctor
 * @route   POST /api/doctors
 * @access  Admin (enforced by middleware)
 */
const addDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update doctor details
 * @route   PUT /api/doctors/:id
 * @access  Admin (enforced by middleware)
 */
const updateDoctor = async (req, res, next) => {
  try {
    const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.status(200).json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a doctor
 * @route   DELETE /api/doctors/:id
 * @access  Admin (enforced by middleware)
 */
const deleteDoctor = async (req, res, next) => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
};
