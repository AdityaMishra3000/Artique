// backend/controllers/auth.controller.js
// This layer handles request validation and formats the final response. 
// It DOES NOT contain core business logic or database queries.

const authService = require('../services/auth.service');

// Handle User Registration Request
exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Basic validation (more comprehensive validation would be ideal here)
        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // The business logic is delegated to the service layer
        const result = await authService.register(username, email, password, role);

        // Send a clean 201 response back to the client
        res.status(201).send({
            message: "User registered successfully!",
            user: {
                id: result.id,
                username: result.username,
                email: result.email,
                role: result.role,
                token: result.token
            }
        });
    } catch (error) {
        // Handle specific errors from the service layer
        if (error.message.includes('already exists')) {
            return res.status(409).send({ message: error.message });
        }
        // Pass generic errors to the global error handler middleware
        next(error);
    }
};

// Handle User Login Request
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required." });
        }

        const result = await authService.login(email, password);

        // Set a cookie (secure option removed for simpler testing environment, add later for production)
        res.cookie('token', result.token, { httpOnly: true, maxAge: 86400000 }); // 1 day validity

        res.status(200).send({
            message: "Login successful!",
            user: {
                id: result.id,
                username: result.username,
                role: result.role
            },
            token: result.token // Optionally return token in body for front-end access
        });
    } catch (error) {
        // Handle authentication failures (e.g., wrong password, user not found)
        if (error.message.includes('Invalid') || error.message.includes('not found')) {
            return res.status(401).send({ message: error.message });
        }
        next(error);
    }
};
