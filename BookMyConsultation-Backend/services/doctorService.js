const Doctor = require('../models/doctorModel');
const { NotFoundError } = require('../middleware/errorHandler');

// Handles the business logic for doctor-related operations
const fetchDoctors = async (specialization) => {
  const query = specialization ? { specialization } : {};
  return await Doctor.find(query).populate('addressId');
};

// Get doctor by ID
const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).populate('addressId');
  if (!doctor) {
    throw new NotFoundError('Doctor not found');
  }
  return doctor;
};

// Creates a new doctor with the provided data
const createDoctor = async (data) => {
  if (!data.specialization) {
    data.specialization = 'GENERAL_PHYSICIAN';
  }
  const doctor = new Doctor(data);
  await doctor.save();
  return doctor;
};

// Updates an existing doctor with the provided data
const updateDoctor = async (doctorId, data) => {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, data, { new: true });
  if (!doctor) throw new Error('Doctor not found');
  return doctor;
};

// Deletes a doctor by ID
const deleteDoctor = async (doctorId) => {
  const doctor = await Doctor.findByIdAndDelete(doctorId);
  if (!doctor) {
    throw new NotFoundError('Doctor not found');
  }
  return doctor;
};

module.exports = {
  fetchDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};