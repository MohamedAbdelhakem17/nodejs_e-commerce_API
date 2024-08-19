const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const CouponModel = require("../../models/CouponModel");

const couponValidator = (isUpdate) => [
  check("id")
    .if(() => isUpdate)
    .notEmpty()
    .withMessage("Coupon ID is required for updates.")
    .isMongoId()
    .withMessage("The provided ID is not a valid MongoDB ObjectId.")
    .custom(async (id) => {
      const existingCoupon = await CouponModel.findById(id);
      if (!existingCoupon) {
        throw new Error("No coupon found with the given ID.");
      }
      return true;
    }),

  check("name")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Coupon name must be between 2 and 20 characters.")
    .custom(async (name) => {
      if (name) {
        const existingCoupon = await CouponModel.findOne({ name });
        if (existingCoupon) {
          throw new Error(
            "A coupon with this name already exists. Please choose a different name."
          );
        }
      }
      return true;
    }),

  check("expired")
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("The expiry date must be insert.")
    .custom((expired) => {
      if (expired) {
        if (new Date(expired) <= new Date()) {
          throw new Error("The expiry date must be a future date.");
        }
      }
      return true;
    }),

  check("discount")
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Discount value is required.")
    .isFloat({ min: 0 })
    .withMessage("Discount must be a positive number greater than zero."),

  validatorMiddleware,
];

const deleteCouponValidator = [
  check("addressId")
    .notEmpty()
    .withMessage("Address ID is required.")
    .isMongoId()
    .withMessage("This is not a valid MongoDB ID.")
    .custom(async (id, { req }) => {
      const existingUser = await CouponModel.findOne({
        _id: req.user._id,
        addresses: { $elemMatch: { _id: id } },
      });

      if (!existingUser) {
        throw new Error("This address does not exist.");
      }
      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  addCouponValidator: couponValidator(false),
  updateCouponValidator: couponValidator(true),
  deleteCouponValidator,
};
