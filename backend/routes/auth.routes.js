// backend/routes/auth.routes.js
const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Route for User Registration
router.post("/register", authController.registerUser);

// Route for User Login
router.post("/login", authController.loginUser);

module.exports = router;
