// const slugify = require("slugify");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const AppError = require("../customError");
const httpStatus = require("../../config/httpStatus");
const UserModel = require("../../models/UserModel");

const changePasswordValidator = [
  check("id")
    .trim()
    .notEmpty()
    .isMongoId()
    .withMessage("This is Not valid Mongo Id"),
    
  check("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (val, { req }) => {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      // 1. Check the old password is correct
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new AppError(
          400,
          httpStatus.FAIL,
          `The current password is not correct`
        );
      }

      // 2. Check if new password matches confirmPassword
      const isSamePassword = String(val) === String(req.body.confirmPassword);
      if (!isSamePassword) {
        throw new AppError(
          400,
          httpStatus.FAIL,
          `New password and confirm password do not match`
        );
      }

      return true;
    }),

  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required"),

  validatorMiddleware,
];

module.exports = {
  changePasswordValidator,
};
