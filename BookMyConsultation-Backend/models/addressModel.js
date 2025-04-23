// Import mongoose and define a schema for the address collection.
// Include fields like addressLine1, city, state, postcode, and userId.
// Use mongoose validators for required fields and data formats.
// Export the schema as a model for use in services.
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^\d{4,6}$/, 'Pincode must be numeric and 4 to 6 digits']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);