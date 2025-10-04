// backend/routes/items.routes.js
// Renamed from items.js for clear file purpose.
const express = require('express');
const itemController = require('../controllers/items.controller');
const { verifyToken, isArtist } = require('../middleware/auth.middleware');

const router = express.Router();

// Public Route: Fetch all items (Read - R in CRUD)
router.get('/', itemController.listItems);

// Protected Routes: Only artists can create, update, or delete items.

// Create Item (C in CRUD) - Requires authentication and must be an artist
router.post('/', verifyToken, isArtist, itemController.createItem);

// Update Item (U in CRUD) - Requires authentication and must be an artist
// NOTE: The controller enforces that only the original artist can update/delete the item.
router.put('/:id', verifyToken, isArtist, itemController.updateItem);

// Delete Item (D in CRUD) - Requires authentication and must be an artist
router.delete('/:id', verifyToken, isArtist, itemController.deleteItem);

module.exports = router;
