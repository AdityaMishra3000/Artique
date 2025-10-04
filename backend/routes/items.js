// // 1. Bring in the Express library.
// const express = require('express');
// //middleware setup

// // 2. Create a new Router object. This is like a mini-application
// // that only handles routes for a specific purpose.
// const router = express.Router();

// // 1. Import our database client.
// const db = require("../db");

// // READ: GET all items
// // This is now an asynchronous function because we're talking to a database.
// router.get("/", async (req, res) => {
//   try {
//     // 2. We use db.query() to run a SQL query.
//     // The `await` keyword tells the code to wait for the database
//     // to respond before moving on.
//     const { rows } = await db.query("SELECT * FROM items");
//     // 3. We send back the data we get from the database.
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// // CREATE: POST a new item
// router.post("/", async (req, res) => {
//   const { name, description } = req.body;
//   try {
//     const { rows } = await db.query(
//       "INSERT INTO items(name, description) VALUES($1, $2) RETURNING *",
//       [name, description]
//     );
//     res.status(201).json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// // READ: GET a single item by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const { rows } = await db.query("SELECT * FROM items WHERE id = $1", [req.params.id]);
//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.status(404).send("Item not found");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// // UPDATE: PUT an existing item by ID
// router.put("/:id", async (req, res) => {
//   const { name, description } = req.body;
//   try {
//     const { rows } = await db.query(
//       "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
//       [name, description, req.params.id]
//     );
//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.status(404).send("Item not found");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// // DELETE: DELETE an item by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const { rowCount } = await db.query("DELETE FROM items WHERE id = $1", [req.params.id]);
//     if (rowCount > 0) {
//       res.status(204).send();
//     } else {
//       res.status(404).send("Item not found");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });
// // 4. We must export the router so our main server file can use it.
// module.exports = router;
