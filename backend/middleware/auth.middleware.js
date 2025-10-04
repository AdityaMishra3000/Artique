const jwt = require('jsonwebtoken');

// Security configuration (In a real app, use environment variables)
const JWT_SECRET = 'your_super_secret_jwt_key'; // CHANGE THIS IN PRODUCTION
// NOTE: Make sure this SECRET matches the one in auth.service.js

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format: "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // 401 Unauthorized: Token missing
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: Token invalid or expired
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        // Token is valid, attach user payload (id, role) to the request
        req.user = user;
        next();
    });
};

// Middleware Factory to check if the user has the required role
// This function returns a middleware function (closure)
exports.checkRole = (requiredRole) => {
    return (req, res, next) => {
        // The previous authenticateToken middleware must have run first
        if (!req.user || req.user.role !== requiredRole) {
            // 403 Forbidden: User does not have permission
            return res.status(403).json({ 
                message: `Access denied. Requires '${requiredRole}' role.`,
                // Optionally log what role they had for debugging
                your_role: req.user ? req.user.role : 'none' 
            });
        }
        next();
    };
};
