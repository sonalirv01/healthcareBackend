// Import express and addressController.
// Create routes for CRUD operations (e.g., GET /addresses, POST /addresses).
// Use middleware like authMiddleware to secure routes where needed.
// Export the router for integration into app.js.

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Get all addresses (admin only)
router.get('/all', [authMiddleware, checkRole('admin')], addressController.getAllAddresses);

// Get user's own addresses
router.get('/', authMiddleware, addressController.getUserAddresses);

// Create a new address
router.post('/', authMiddleware, addressController.addAddress);

// Get, update or delete specific address (with ownership check in controller)
router.get('/:id', authMiddleware, addressController.getAddressById);
router.put('/:id', authMiddleware, addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports = router;