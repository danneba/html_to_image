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
  const email = req.body.email;
  const password = req.body.password;

  const client = await pool.connect();
  try {
    const query = `SELECT * FROM users where email = $1`;
    const values = [email];

    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result.rows[0];
    const isPasswordMatches = await bcrypt.compare(password, user.password);
    if (!isPasswordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwtUtils.generateJWT(user.id, user.email);
    res.json({ token });
  } catch (error) {
    console.error(`Error fetching user: ${error.message} `);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
};

module.exports = { login };
