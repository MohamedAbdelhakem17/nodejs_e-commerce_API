const express = require("express");

const AuthValidator = require("../utils/validators/authValidator");
const AuthController = require("../controller/AuthController");

const router = express.Router();

router.post("/signup", AuthValidator.signupValidator, AuthController.signup);
router.post("/login", AuthController.login);

// reset Password
router.post(
  "/forgotPassword",
  AuthValidator.forgotPasswordValidator,
  AuthController.forgotPassword
);
router.post(
  "/verifyResetCode",
  AuthValidator.verifyResetCodeValidator,
  AuthController.verifyPassResetCode
);
router.put(
  "/resetPassword",
  AuthValidator.resetPasswordValidator,
  AuthController.resetPassword
);

module.exports = router;
