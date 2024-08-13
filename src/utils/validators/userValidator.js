const slugify = require("slugify");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../models/UserModel");

const createUserValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("This is not a valid email.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findOne({ email: val });
      if (user) {
        throw new Error("This email is already used.");
      }
      return true;
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    .withMessage(
      "Your password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password and confirm password do not match.");
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required."),

  check("profileImg").optional(),

  check("role").optional(),

  check("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("ar-EG")
    .withMessage("Please insert a valid Egyptian phone number."),
  validatorMiddleware,
];

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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    .withMessage(
      "Your password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .custom(async (val, { req }) => {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      // 1. chek if User exist
      if (!user) {
        throw new Error("This User Not Exist ");
      }
      // 2. Check the old password is correct
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error(`The current password is not correct`);
      }

      // 3. Check if new password matches confirmPassword
      const isSamePassword = String(val) === String(req.body.confirmPassword);
      if (!isSamePassword) {
        throw new Error(`New password and confirm password do not match`);
      }

      return true;
    }),

  check("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required"),

  validatorMiddleware,
];

const updateUserValidator = [
  check("id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("This is not a valid ID.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found.");
      }
      return true;
    }),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("This is not a valid email.")
    .custom(async (val, { req }) => {
      const existingUser = await UserModel.findOne({ email: val });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        throw new Error("This email is already used by another user.");
      }
      return true;
    }),

  check("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("ar-EG")
    .withMessage("Please insert a valid Egyptian phone number."),

  validatorMiddleware,
];

const getUserValidator = [
  check("id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("This is not a valid ID.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found.");
      }
      return true;
    }),
  validatorMiddleware,
];

const deleteserValidator = [
  check("id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("This is not a valid ID.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found.");
      }
      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  createUserValidator,
  changePasswordValidator,
  updateUserValidator,
  deleteserValidator,
  getUserValidator,
};
