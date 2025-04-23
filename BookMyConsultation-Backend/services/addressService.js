// Import the addressModel to interact with the database.
// Define functions for business logic:
// - fetchAddresses: Query the database for addresses by userId.
// - createAddress: Insert a new address document into the collection.
// Handle database errors and return structured data for controllers.

const Address = require('../models/addressModel');

// Get all addresses (for admin)
const getAllAddresses = async () => {
  return await Address.find();
};

// Get all addresses for a specific user
const getAddressesByUser = async (userId) => {
  return await Address.find({ userId });
};

// Create a new address
const addAddress = async (data) => {
  const address = new Address(data);
  return await address.save();
};

// Get address by ID
const getAddressById = async (id) => {
  return await Address.findById(id);
};

// Update address by ID
const updateAddress = async (id, updateData) => {
  return await Address.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete address by ID
const deleteAddress = async (id) => {
  return await Address.findByIdAndDelete(id);
};

module.exports = {
  getAllAddresses,
  getAddressesByUser,
  addAddress,
  getAddressById,
  updateAddress,
  deleteAddress
};