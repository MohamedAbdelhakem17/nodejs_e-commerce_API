const express = require("express");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware");

const userValidator = require("../utils/validators/userValidator");
const UserController = require("../controller/UserController");

const router = express.Router();

router.use(AuthController.protect);

router.get("/getme", UserController.getLoogedUserData, UserController.getUser);

router.put(
  "/changeMyPassword",
  userValidator.changeMyPasswordValidator,
  UserController.updataLoogedUserPassword
);

router.put(
  "/updateMyData",
  userValidator.updataLoggedUserDataValidator,
  UserController.updataLoogedUserData
);

router.delete("/deleteMe", UserController.deleteMe);

router.use(allowTo(userRoles.ADMIN, userRoles.MANGER));

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
  "/changePassword/:id",
  userValidator.changePasswordValidator,
  UserController.changePassword
);

router.delete(
  "/delete/:id",
  allowTo(userRoles.ADMIN),
  userValidator.deleteserValidator,
  UserController.deleteUser
);

module.exports = router;
