const { check, validationResult } = require("express-validator");

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

module.exports = { usernameValidation, emailValidation, passwordValidation };
