// backend/services/items.service.js
// This layer contains all data access and core business logic for the Marketplace items.
const db = require('../db');

/**
 * Service to fetch all items from the database.
 */
exports.getAllItems = async () => {
    const result = await db.query('SELECT * FROM itemz ORDER BY created_at DESC'); // REFERENCES itemz
    return result.rows;
};

/**
 * Service to create a new item.
 * @param {object} itemData - Contains name, description, price, artist_id.
 * @returns {object} The newly created item.
 */
exports.createItem = async ({ name, description, price, artist_id }) => {
    const result = await db.query(
        'INSERT INTO itemz (name, description, price, artist_id) VALUES ($1, $2, $3, $4) RETURNING *', // REFERENCES itemz
        [name, description, price, artist_id]
    );
    return result.rows[0];
};

/**
 * Service to update an existing item by ID.
 */
exports.updateItem = async (itemId, { name, description, price }, artistId) => {
    const result = await db.query(
        'UPDATE itemz SET name = $1, description = $2, price = $3 WHERE id = $4 AND artist_id = $5 RETURNING *', // REFERENCES itemz
        [name, description, price, itemId, artistId]
    );

    if (result.rows.length === 0) {
        throw new Error('Item not found or unauthorized to update.');
    }
    return result.rows[0];
};

/**
 * Service to delete an item by ID.
 */
exports.deleteItem = async (itemId, artistId) => {
    // Ensure only the artist who created the item can delete it
    const result = await db.query('DELETE FROM itemz WHERE id = $1 AND artist_id = $2 RETURNING id', [itemId, artistId]); // REFERENCES itemz
    
    if (result.rows.length === 0) {
        throw new Error('Item not found or unauthorized to delete.');
    }
    return true;
};
