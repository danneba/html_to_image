const { check, validationResult } = require("express-validator");

const loginValidation = [
  check("email").notEmpty().withMessage("Email is Required"),
  check("password").notEmpty().withMessage("Password is Required"),
];

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { loginValidation, validateLogin };
