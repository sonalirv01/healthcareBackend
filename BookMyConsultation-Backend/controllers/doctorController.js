// Implement doctor-related route handlers here.
// Example handlers:
// - getDoctors: Fetch all doctors or by specialization.
// - addDoctor: Add a new doctor record.
// - updateDoctor: Update doctor details.
// Use the doctorService for interactions with the database.

const doctorService = require('../services/doctorService');

// @desc Get all doctors or by specialization (public)
const getDoctors = async (req, res, next) => {
  try {
    const { specialization } = req.query;
    const doctors = await doctorService.fetchDoctors(specialization);
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc Get doctor by ID (public)
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

// @desc Add a new doctor (admin only - middleware enforces this)
const addDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc Update doctor details (admin only - middleware enforces this)
const updateDoctor = async (req, res, next) => {
  try {
    const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
    res.status(200).json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

// @desc Delete doctor (admin only - middleware enforces this)
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
  deleteDoctor
};