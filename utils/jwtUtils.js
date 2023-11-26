const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateJWT = (userId, email) => {
  const payload = {
    userId,
    email,
  };
  const secretKey = crypto.randomBytes(32).toString("hex");
  const options = { expiresIn: "24h" };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = { generateJWT };
