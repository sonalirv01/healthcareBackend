const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email']
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits']
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);