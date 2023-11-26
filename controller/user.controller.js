const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");
const { check, validationResult } = require("express-validator");
const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
  Client: Client,
});

const signup = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name, email, password);
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await pool.connect();

    const fetchUsernameQuery = `SELECT * FROM users WHERE name = $1`;
    const fetchEmailQuery = `SELECT * FROM users WHERE email = $1`;

    try {
      const usernameResult = await client.query(fetchUsernameQuery, [name]);
      const emailResult = await client.query(fetchEmailQuery, [email]);

      if (usernameResult.rows.length > 0) {
        return res.status(400).json({ message: "Username already Exists" });
      }
      if (emailResult.rows.length > 0) {
        return res.status(400).json({ message: "Email already Exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = `INSERT INTO users(name, email, password) VALUES($1, $2, $3)RETURNING id`;
      const insertedUser = await client.query(insertUserQuery, [
        name,
        email,
        hashedPassword,
      ]);
      const userId = insertedUser.rows[0].id;

      const token = jwtUtils.generateJWT(userId, name);
      res.json({ token });
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  } catch (dbError) {
    console.error(dbError);
    res.status(500).json({ error: "Error connecting into databse" });
  }
};

module.exports = { signup };
