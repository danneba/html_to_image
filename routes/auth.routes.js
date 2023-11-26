const express = require("express");

const { login } = require("../controller/auth.controller");

const {
  loginValidation,
  validateLogin,
} = require("../middleware/auth.validation");

const router = express.Router();

router.post("/login", loginValidation, validateLogin, login);

module.exports = router;
