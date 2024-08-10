const express = require("express");
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
module.exports = router;
