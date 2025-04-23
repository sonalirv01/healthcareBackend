// Import the addressService and handle incoming requests.
// Example function:
// - getAllAddresses(req, res): Call service to fetch addresses and send a response.
// - addAddress(req, res): Call service to create an address with req.body data.
// Use try-catch for error handling and send appropriate HTTP status codes in responses.
// Export the controller functions for routing.

const addressService = require('../services/addressService');
const { AuthorizationError } = require('../middleware/errorHandler');

// Get all addresses (admin only)
const getAllAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

// Get user's own addresses
const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddressesByUser(req.user.id);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

// Add a new address
const addAddress = async (req, res, next) => {
  try {
    const addressData = {
      ...req.body,
      userId: req.user.id
    };
    const address = await addressService.addAddress(addressData);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

// Get a specific address with ownership check
const getAddressById = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Allow if admin or address owner
    if (req.user.role !== 'admin' && address.userId.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to access this address');
    }
    
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

// Update with ownership check
const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Allow if admin or address owner
    if (req.user.role !== 'admin' && address.userId.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to update this address');
    }
    
    const updated = await addressService.updateAddress(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete with ownership check
const deleteAddress = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Allow if admin or address owner
    if (req.user.role !== 'admin' && address.userId.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to delete this address');
    }
    
    await addressService.deleteAddress(req.params.id);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAddresses,
  getUserAddresses,
  addAddress,
  getAddressById,
  updateAddress,
  deleteAddress
};