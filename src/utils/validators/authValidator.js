const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../models/UserModel");

const signupValidator = [
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

const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];

const forgotPasswordValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("This is not a valid email.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findOne({ email: val });
      if (!user) {
        throw new Error(`No user found for this email: ${val}`);
      }
      return true;
    }),

  validatorMiddleware,
];

const verifyResetCodeValidator = [
  check("resetCode")
    .trim()
    .notEmpty()
    .withMessage("Reset code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be exactly 6 digits long."),
  validatorMiddleware,
];

const resetPasswordValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("This is not a valid email.")
    .custom(async (val, { req }) => {
      const user = await UserModel.findOne({ email: val });
      if (!user) {
        throw new Error(`No user found for this email: ${val}`);
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
  validatorMiddleware,
];

module.exports = {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
};
