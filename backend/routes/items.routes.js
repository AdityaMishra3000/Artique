const express = require('express');
// NOTE: Assuming your controller directory is named 'controller' (singular)
const itemsController = require('../controllers/items.controller'); 
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Public route: Get all items (Read - R)
// CORRECTED: Mapped to itemsController.listItems (as exported in controller)
router.get('/', itemsController.listItems); 

// Protected routes: Only artists can create, update, or delete items
// Create a new item (Create - C)
router.post('/', authenticateToken, checkRole('artist'), itemsController.createItem);

// Update an item (Update - U)
router.put('/:id', authenticateToken, checkRole('artist'), itemsController.updateItem);

// Delete an item (Delete - D)
router.delete('/:id', authenticateToken, checkRole('artist'), itemsController.deleteItem);

module.exports = router;
