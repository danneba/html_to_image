const { check, validationResult } = require("express-validator");

const loginValidation = [
  check("username").notEmpty().withMessage("Username is Required"),
  check("password").notEmpty().withMessage("Password is Required"),
];

const validateLogin = (req, res, next) => {
  const errors = validateResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { loginValidation, validateLogin };
