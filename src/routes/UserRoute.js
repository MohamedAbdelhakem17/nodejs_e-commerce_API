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
    UserController.createUser
  );

router
  .route("/:id")
  .get(UserController.getUser)
  .put(
    UserController.userImageUpload,
    UserController.imageManipulation,
    UserController.updateUser
  );

router.put("/delete/:id", UserController.deleteUser);

router.put(
  "/changePassword/:id",
  userValidator.changePasswordValidator,
  UserController.changePassword
);

module.exports = router;
