// models/appointment.js

// Import mongoose to define the schema and model for appointments
const mongoose = require('mongoose');

// Define the appointment schema for the Appointment collection
const appointmentSchema = new mongoose.Schema({
  // Reference to the User model (the user who made the appointment)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true // Ensures a userId is provided
  },
  // Reference to the Doctor model (the doctor the appointment is with)
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // References the Doctor model
    required: true // Ensures a doctorId is provided
  },
  // Appointment date (must be a future date)
  appointmentDate: {
    type: Date,
    required: true, // Ensures appointmentDate is provided
    validate: {
      validator: value => value > new Date(), // Ensures the appointment date is in the future
      message: 'Appointment date must be in the future'
    }
  },
  // Status of the appointment (default is 'booked')
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'], // Only allows these values for the status
    default: 'booked' // Default value is 'booked'
  },
  // Additional notes related to the appointment (optional)
  notes: {
    type: String,
    trim: true // Removes leading/trailing spaces from the notes
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the schema as a model for use in services
module.exports = mongoose.model('Appointment', appointmentSchema);
