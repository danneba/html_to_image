const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

const signup = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const client = await pool.client();

  const fetchUsernameQuery = `SELECT * FROM users WHERE username = $1`;
  const fetchEmailQuery = `SELECT * FROM users WHERE email = $1`;

  try {
    const usernameResult = await client.query(fetchUsernameQuery, [username]);
    const emailResult = await client.query(fetchEmailQuery, email);
  } catch (error) {}
};
