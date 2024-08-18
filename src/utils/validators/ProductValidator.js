const { check } = require("express-validator");
const slugify = require("slugify");
const CategoryModel = require("../../models/CategoryModel");
const subCategoryModel = require("../../models/SubCategoryModel");
const brandModel = require("../../models/BrandModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const productValidator = (isUpdate) => [
  check("id")
    .if(() => isUpdate)
    .isMongoId()
    .withMessage("This is not a valid mongo id"),

  check("title")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Title must be at least 3 characters and no more than 100 characters"
    )
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  check("price")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ max: 200000 })
    .withMessage("Price must not exceed 200000"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .isFloat({ max: 200000 })
    .withMessage("Price after discount must not exceed 200000")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error(
          "Price after discount must be less than or equal to price"
        );
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be an array of strings"),

  check("imageCover").optional(isUpdate).trim().notEmpty().withMessage("Image cover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),

  check("category")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("This is not a valid mongo id")
    .custom(async (id) => {
      const category = await CategoryModel.findById(id);
      if (!category) throw new Error(`No category found for id: ${id}`);
    }),

  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be an array of valid Mongo IDs")
    .custom(async (subcategoriesIds) => {
      const subCategoriesIdsInDB = await subCategoryModel.find({
        _id: { $in: subcategoriesIds },
      });
      if (
        subCategoriesIdsInDB.length < 1 ||
        subCategoriesIdsInDB.length !== subcategoriesIds.length
      ) {
        throw new Error(`Invalid subcategory IDs`);
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const subCategorys = await subCategoryModel.find({
        category: req.body.category,
      });
      const subcategoryIds = subCategorys.map((subcategory) =>
        subcategory._id.toString()
      );
      const checker = value.every((v) => subcategoryIds.includes(v));
      if (!checker)
        throw new Error(
          "Subcategories do not belong to the specified category"
        );
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("This is not a valid mongo id")
    .custom(async (value) => {
      const brand = await brandModel.findById(value);
      if (!brand) throw new Error(`No brand found for id: ${value}`);
    }),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number.")
    .custom((value) => {
      if (value < 1 || value > 5) {
        throw new Error("Ratings average must be between 1.0 and 5.0.");
      }
      return true;
    }),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),

  validatorMiddleware,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("This is not avalid mongo id"),
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("This is not avalid mongo id"),
  validatorMiddleware,
];

module.exports = {
  createProductValidator: productValidator(false),
  getProductValidator,
  updateProductValidator: productValidator(true),
  deleteProductValidator,
};
