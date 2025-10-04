// CORE DEPENDENCIES
const express = require("express");
const cors = require("cors");
const itemsRouter = require("./routes/items.routes"); // Renamed the file for better organization
const authRouter = require("./routes/auth.routes"); // NEW: Authentication routes

const app = express();
const port = 3000;

// MIDDLEWARE SETUP
// 1. CORS: Allow frontend to communicate with backend
app.use(cors());

// 2. JSON Parser: Parse incoming JSON request bodies (e.g., for login/register data)
app.use(express.json());

// ROUTE HANDLERS
// NEW: Authentication routes for registration and login
app.use("/api/auth", authRouter);

// Existing: Marketplace item routes
app.use("/api/items", itemsRouter); 

// Core Route (Status Check)
app.get("/", (req, res) => {
  res.send("Artique Backend API is scalable and operational!");
});

// GLOBAL ERROR HANDLER (For catching synchronous and unhandled asynchronous errors)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging
    res.status(500).send({
        message: 'A critical server error occurred.',
        error: err.message
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
