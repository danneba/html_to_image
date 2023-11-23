const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");
const { check, validationResult } = require("express-validator");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const signup = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const usernameValidation = check("name")
    .notEmpty()
    .withMessage("Username is Required")
    .isLength({ min: 4 })
    .withMessage("Username can not be lessthan 4");
  const emailValidation = check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email");

  const passwordValidation = check("password")
    .isStrongPassword()
    .withMessage("password must be at least 8 characters");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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
    const insertUserQuery = `INSERT INTO users(name, email, password) VALUES($1, $2, $3)`;
    await client.query(insertUserQuery, [name, email, hashedPassword]);
    const token = jwtUtils.generateJWT(user.id, name);
    res.json({ token });
    client.release();
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signup };
