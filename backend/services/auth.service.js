// backend/services/auth.service.js
// This layer contains all core business logic (hashing, JWT generation, database queries).
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assume db.js exports a connected PostgreSQL client

// Use a placeholder secret for development. In production, use a secure environment variable.
const JWT_SECRET = 'your_super_secret_key_for_artique_dev'; 

/**
 * Creates a JWT token for the given user ID and role.
 * @param {number} userId - The user's database ID.
 * @param {string} role - The user's role ('user' or 'artist').
 * @returns {string} The generated JWT.
 */
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, JWT_SECRET, { expiresIn: '1d' });
};


// ------------------------------------------------------------------
// Core Business Logic: Registration
// ------------------------------------------------------------------
exports.register = async (username, email, password, role = 'user') => {
    // 1. Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists.');
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Save to Database
    const newUser = await db.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
        [username, email, passwordHash, role]
    );

    const user = newUser.rows[0];

    // 4. Generate token
    const token = generateToken(user.id, user.role);

    return { ...user, token };
};

// ------------------------------------------------------------------
// Core Business Logic: Login
// ------------------------------------------------------------------
exports.login = async (email, password) => {
    // 1. Find the user by email
    const userResult = await db.query('SELECT id, username, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
        throw new Error('User not found.');
    }
    const user = userResult.rows[0];

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials.');
    }

    // 3. Generate token
    const token = generateToken(user.id, user.role);

    return { id: user.id, username: user.username, role: user.role, token };
};
