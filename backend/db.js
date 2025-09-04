// 1. We import the `Pool` class from the `pg` library.
// The `Pool` manages a pool of client connections to the database.
// This is more efficient than creating a new connection for every single query.
const { Pool } = require("pg");

// 2. We define the configuration for our database connection.
// IMPORTANT: You'll need to change these values to match your own Postgres setup.
// - user: Your Postgres username
// - host: Usually 'localhost' for local development
// - database: The name of the database you created for Artique
// - password: Your Postgres password
// - port: The port your Postgres server is running on (usually 5432)
const pool = new Pool({
  user: "adityam",
  host: "localhost",
  database: "artique", // Assuming you've created a database named 'artique'
  password: "tida@2344",
  port: 5432,
});

// 3. We export the `pool` object so that other files in our application
// can import it and use it to run queries.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
