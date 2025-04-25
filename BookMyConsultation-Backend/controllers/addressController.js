// controllers/addressController.js

const addressService = require('../services/addressService');
const { AuthorizationError } = require('../middleware/errorHandler');

/**
 * @desc    Get all addresses (admin only)
 * @route   GET /api/addresses
 * @access  Admin
 */
const getAllAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get addresses of the logged-in user
 * @route   GET /api/addresses/user
 * @access  Private
 */
const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddressesByUser(req.user.id);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new address for the logged-in user
 * @route   POST /api/addresses
 * @access  Private
 */
const addAddress = async (req, res, next) => {
  try {
    const addressData = {
      ...req.body,
      userId: req.user.id,
    };
    const address = await addressService.addAddress(addressData);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific address by ID (admin or owner only)
 * @route   GET /api/addresses/:id
 * @access  Private/Admin
 */
const getAddressById = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (req.user.role !== 'admin' && address.userId.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to access this address');
    }

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an address by ID (admin or owner only)
 * @route   PUT /api/addresses/:id
 * @access  Private/Admin
 */
const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (req.user.role !== 'admin' && address.userId.toString() !== req.user.id) {
      throw new AuthorizationError('Not authorized to update this address');
    }

    const updated = await addressService.updateAddress(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an address by ID (admin or owner only)
 * @route   DELETE /api/addresses/:id
 * @access  Private/Admin
 */
const deleteAddress = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

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
  deleteAddress,
};
