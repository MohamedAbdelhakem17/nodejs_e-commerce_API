const express = require("express");

const userValidator = require("../utils/validators/userValidator");
const UserController = require("../controller/UserController");

const router = express.Router();

router
  .route("/")
  .get(UserController.getUsers)
  .post(
    UserController.userImageUpload,
    UserController.imageManipulation,
    userValidator.createUserValidator,
    UserController.createUser
  );

router
  .route("/:id")
  .get(userValidator.getUserValidator, UserController.getUser)
  .put(
    UserController.userImageUpload,
    UserController.imageManipulation,
    userValidator.updateUserValidator,
    UserController.updateUser
  );

router.put(
  "/delete/:id",
  userValidator.deleteserValidator,
  UserController.deleteUser
);

router.put(
  "/changePassword/:id",
  userValidator.changePasswordValidator,
  UserController.changePassword
);

module.exports = router;
