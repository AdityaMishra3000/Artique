// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// Use same secret key as defined in auth.service.js
const JWT_SECRET = 'your_super_secret_key_for_artique_dev'; 

/**
 * Middleware function to verify JWT and attach user data (id, role) to the request.
 * Protects routes requiring authentication.
 */
exports.verifyToken = (req, res, next) => {
    // 1. Get the token from the header (Bearer Token format)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "Authentication token missing." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: "Token format is invalid." });
    }

    try {
        // 2. Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Attach user info (id, role) to the request object
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).send({ message: "Invalid or expired token." });
    }
};

/**
 * Middleware function to restrict access to 'artist' role only.
 */
exports.isArtist = (req, res, next) => {
    // Check if user object was attached by verifyToken middleware and if role is 'artist'
    if (req.user && req.user.role === 'artist') {
        next();
    } else {
        return res.status(403).send({ message: "Access denied. Artist role required." });
    }
};
