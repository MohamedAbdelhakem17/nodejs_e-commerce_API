const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ProductModel = require("../../models/ProductModel");


const addToWishListValidator = [
    check("productId")
      .trim()
      .notEmpty()
      .withMessage("product Id is required.")
      .isMongoId()
      .withMessage("This is not a valid ID.")
      .custom(async (val, { req }) => {
        const product = await ProductModel.findById(val);
        if (!product) {
          throw new Error("This Product  not found.");
        }
        return true;
      }),
    validatorMiddleware,
  ];

  module.exports = {
    addToWishListValidator
  }