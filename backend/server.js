// 1. First, we bring in the Express library.
const express = require("express");

// 2. Then, we bring in our new router file.
const itemsRouter = require("./routes/items");

// Import the 'cors' middleware
const cors = require("cors");

// 3. We create an instance of the Express application.
const app = express();

// 4. We define a 'port' for our server to listen on.
const port = 3000;

// 5. This is a crucial middleware. It tells Express to parse
// the JSON data sent in a request body (e.g., from POST or PUT requests)
// and make it available on the `req.body` property.
app.use(express.json());

// THIS IS THE LINE THAT WAS MISSING IN THE LOGIC.
// It tells Express to enable CORS for all requests.
app.use(cors());


// 6. Our first route, which remains in the main file.
app.get("/", (req, res) => {
  res.send("Welcome to the Artique Backend API!");
});

// 7. We use app.use() to tell our server to use the itemsRouter we imported.
app.use("/api/items", itemsRouter);

// 8. This is the core command to start the server.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
