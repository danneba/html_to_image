const express = require("express");

const { signup } = require("../controller/user.controller");

const {
  emailValidation,
  usernameValidation,
  passwordValidation,
} = require("../middleware/user.validation");

const router = express.Router();

router.post(
  "/signup",
  [emailValidation, usernameValidation, passwordValidation],
  signup
);

module.exports = router;
