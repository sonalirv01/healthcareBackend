// models/user.js

// Import mongoose and bcrypt for handling schema and password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema for the User collection
const userSchema = new mongoose.Schema({
  // User's first name (required and trimmed)
  firstName: {
    type: String,
    required: [true, 'First name is required'], // Ensures firstName is provided
    trim: true // Removes leading/trailing spaces from the first name
  },
  // User's last name (required and trimmed)
  lastName: {
    type: String,
    required: [true, 'Last name is required'], // Ensures lastName is provided
    trim: true // Removes leading/trailing spaces from the last name
  },
  // User's date of birth (optional)
  dob: {
    type: Date // Allows user to provide their date of birth
  },
  // User's mobile number (required and validated for a 10-digit number)
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'], // Ensures mobile is provided
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'] // Validates mobile number format
  },
  // User's email address (required, unique, validated, and converted to lowercase)
  emailId: {
    type: String,
    required: [true, 'Email is required'], // Ensures email is provided
    unique: true, // Ensures email is unique
    lowercase: true, // Converts email to lowercase before saving
    trim: true, // Removes leading/trailing spaces from email
    match: [/.+@.+\..+/, 'Please enter a valid email'] // Validates email format
  },
  // User's password (required, validated for length)
  password: {
    type: String,
    required: [true, 'Password is required'], // Ensures password is provided
    minlength: [6, 'Password must be at least 6 characters'] // Validates password length
  },
  // User's role (can either be 'user' or 'admin', default is 'user')
  role: {
    type: String,
    enum: ['user', 'admin'], // Only allows 'user' or 'admin' as valid roles
    default: 'user' // Defaults to 'user' if no role is provided
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip hashing if the password is not modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with a cost factor of 10
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next(); // Proceed to save the document
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // Compares candidate password with the hashed password
};

// Export the schema as a model for use in services
module.exports = mongoose.model('User', userSchema);
