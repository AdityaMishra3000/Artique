// backend/controllers/items.controller.js
// This layer handles request/response formatting and calls the service layer.
const itemService = require('../services/items.service');

// GET /api/items - Fetch all items
exports.listItems = async (req, res, next) => {
    try {
        const items = await itemService.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

// POST /api/items - Create a new item (Protected by auth middleware)
exports.createItem = async (req, res, next) => {
    try {
        const { name, description, price } = req.body;
        
        // Validation: All fields are required
        if (!name || !description || price === undefined) {
            return res.status(400).send({ message: "Name, description, and price are required." });
        }

        // Get artist ID from the token attached by verifyToken middleware
        const artist_id = req.user.id; 

        const newItem = await itemService.createItem({ name, description, price, artist_id });
        
        res.status(201).json({ message: "Item created successfully.", item: newItem });
    } catch (error) {
        next(error);
    }
};

// PUT /api/items/:id - Update an item (Protected)
exports.updateItem = async (req, res, next) => {
    try {
        const itemId = parseInt(req.params.id);
        const { name, description, price } = req.body;
        
        // Simple validation
        if (!name && !description && price === undefined) {
             return res.status(400).send({ message: "At least one field (name, description, or price) must be provided for update." });
        }
        
        // Get artist ID from token attached by verifyToken middleware
        const artistId = req.user.id;

        const updatedItem = await itemService.updateItem(itemId, { name, description, price }, artistId);
        
        res.status(200).json({ message: "Item updated successfully.", item: updatedItem });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).send({ message: error.message });
        } else if (error.message.includes('unauthorized')) {
             return res.status(403).send({ message: error.message });
        }
        next(error);
    }
};

// DELETE /api/items/:id - Delete an item (Protected)
exports.deleteItem = async (req, res, next) => {
    try {
        const itemId = parseInt(req.params.id);
        const artistId = req.user.id; // Get artist ID from token
        
        await itemService.deleteItem(itemId, artistId);
        
        res.status(204).send(); // 204 No Content is standard for successful deletion
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).send({ message: error.message });
        } else if (error.message.includes('unauthorized')) {
             return res.status(403).send({ message: error.message });
        }
        next(error);
    }
};
