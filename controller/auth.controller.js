const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // const client = await pool.connect();
  // try {
  //   const query = `SELECT * FROM users where username = $1`;
  //   const values = [username];

  //   const result = await client.query(query, values);
  //   if (result.rows.length === 0) {
  //     return res.status(401).json({ message: "Invalid username or password" });
  //   }
  //   const user = result.rows[0];
  //   const isPasswordMatches = await bcrypt.compare(password, user.password);
  //   if (isPasswordMatches) {
  //     return res.status(401).json({ message: "Invalid username or password" });
  //   }
  //   const token = jwtUtils.generateJWT(user.id, user.username);
  //   res.json({ token });
  // } catch (error) {
  //   console.error(`Error fetching user: ${error.message} `);
  //   res.status(500).json({ message: "Internal Server Error" });
  // } finally {
  //   client.release();
  // }
  const token = jwtUtils.generateJWT(1, username);
  res.json({ token });
};

module.exports = { login };
