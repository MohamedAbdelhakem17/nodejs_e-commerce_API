const { check } = require("express-validator");
const userRoles = require("../../config/userRoles");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const UserModel = require("../../models/UserModel");
const ReviewModel = require("../../models/ReviewModel");

const createReviewValidator = [
  check("title").optional().notEmpty().withMessage("Title must not be empty"),

  check("rating")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),

  check("user")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);

      if (!user) throw new Error(`No user found for this ID: ${val}`);
      if (user._id.toString() !== req.user._id.toString())
        throw new Error(
          `You can't add a review with a different ID for another user.`
        );
    }),

  check("product")
    .isMongoId()
    .withMessage("This is not a valid Mongo ID")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findOne({
        product: req.body.product,
        user: req.user._id,
      });

      if (review) throw new Error("You have already reviewed this product");
      return true;
    }),

  validatorMiddleware,
];

const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findById(val);
      if (!review) throw new Error(`No review found for this ID: ${val}`);

      if (req.user._id.toString() !== review.user._id.toString())
        throw new Error("You are not authorized to perform this action");

      if (req.body.user && req.body.user !== req.user._id.toString()) {
        const user = await UserModel.findById(req.body.user);
        if (!user) throw new Error(`No user found for this ID: ${req.body.user}`);

        if (user._id.toString() !== req.user._id.toString())
          throw new Error("You can't update a review with a different ID for another user.");
      }

      return true;
    }),

  validatorMiddleware,
];

const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findById(val);
      if (!review) throw new Error(`NO review For This Id ${val}`);

      if (req.user.role === userRoles.USER) {
        if (req.user._id.toString() !== review.user._id.toString())
          throw new Error("You are not authorized to perform this action");
      }

      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
