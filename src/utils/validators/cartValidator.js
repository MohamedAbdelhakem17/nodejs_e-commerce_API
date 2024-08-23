const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const ProductModel = require("../../models/ProductModel");

const addProductToCartValidator = [
  check("product")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid Product ID format.")
    .custom(async (id, { req }) => {
      const product = await ProductModel.findById(id);
      if (!product) throw new Error("Product does not exist.");
      req.product = product;
      return true;
    }),

  check("color")
    .optional()
    .custom((color, { req }) => {
      const { product } = req;
      const colorExists = product ? product.colors.includes(color) : false;
      if (!colorExists)
        throw new Error("Selected color is not available for this product.");
      return true;
    }),

  check("size")
    .optional()
    .custom((size, { req }) => {
      const { product } = req;
      const sizeExists = product ? product.sizes.includes(size) : false;
      if (!sizeExists)
        throw new Error("Selected size is not available for this product.");
      return true;
    }),

  check("quantity")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Quantity must be a positive number.")
    .custom(async (val, { req }) => {
      const { product } = req;
      
      if (Number(product.quantity) < Number(val)) {
        throw new Error(`quantity ${val} is not available`);
      }
      return true;
    }),

  validatorMiddleware,
];

const updateProductQuantityInCartValidator = [
  check("itemId").trim().notEmpty().withMessage("Item ID is required."),

  check("quantity")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Quantity must be a positive number."),

  validatorMiddleware,
];

module.exports = {
  addProductToCartValidator,
  updateProductQuantityInCartValidator,
};
