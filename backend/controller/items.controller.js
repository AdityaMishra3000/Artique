const itemsService = require('../services/items.service');

// Handles POST /api/items
exports.createItem = async (req, res, next) => {
    // Note: Authentication middleware has already populated req.user
    const { name, description, price } = req.body;
    const artistId = req.user.id; // Get artistId from authenticated token

    if (!name || !description || !price) {
        return res.status(400).json({ message: 'All fields (name, description, price) are required.' });
    }

    try {
        const newItem = await itemsService.createItem({ name, description, price, artistId });
        res.status(201).json({ 
            message: 'Item created successfully.',
            item: { id: newItem.id, name: newItem.name, artist_id: newItem.artist_id }
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

// Handles GET /api/items
exports.getAllItems = async (req, res, next) => {
    try {
        const items = await itemsService.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

// Handles PUT /api/items/:id
exports.updateItem = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    if (updates.price) {
        updates.price = parseFloat(updates.price);
    }
    
    try {
        // Service handles authorization (checking if the user owns the item)
        const updatedItem = await itemsService.updateItem(id, updates, userId);
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found or unauthorized to update.' });
        }
        res.status(200).json({ 
            message: 'Item updated successfully.',
            item: updatedItem 
        });
    } catch (error) {
        next(error);
    }
};

// Handles DELETE /api/items/:id
exports.deleteItem = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Service handles authorization
        const deleted = await itemsService.deleteItem(id, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Item not found or unauthorized to delete.' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
