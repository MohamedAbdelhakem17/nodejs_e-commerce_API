const express = require("express");

const AuthValidator = require("../utils/validators/authValidator");
const AuthController = require("../controller/AuthController");

const router = express.Router();

router.post("/signup", AuthValidator.signupValidator, AuthController.signup);
router.post("/login",  AuthController.login);

module.exports = router;
