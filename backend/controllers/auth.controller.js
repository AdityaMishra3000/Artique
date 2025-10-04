const authService = require('../services/auth.service');

// Handles POST /api/auth/register
exports.registerUser = async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    try {
        const result = await authService.registerUser({ username, email, password, role });
        res.status(201).json({ 
            message: 'Registration successful.',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
};

// Handles POST /api/auth/login
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for login.' });
    }

    try {
        const result = await authService.loginUser({ email, password });
        res.status(200).json({
            message: 'Login successful.',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        // 401 is Unauthorized status
        res.status(401).json({ message: error.message || 'Invalid credentials.' });
    }
};
