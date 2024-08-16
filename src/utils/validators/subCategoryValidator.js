const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const CategoryModel = require("../../models/CategoryModel");

const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

const subcategoryValidator = (isUpdate) => [
  check("id")
    .if(() => isUpdate)
    .isMongoId()
    .withMessage("This Is Not Valid Mongo Id"),

  check("name")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("You Must Insert Category Name")
    .isLength({ min: 2, max: 32 })
    .withMessage("Sub Category must be between 2 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .optional(isUpdate)
    .isMongoId()
    .withMessage("This Is Not Valid Mongo Id")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) throw new Error("Category does not exist");
      else return true;
    }),
  validatorMiddleware,
];

const deletSubcategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

module.exports = {
  getSubcategoryValidator,
  createSubcategoryValidator: subcategoryValidator(false),
  updateSubcategoryValidator: subcategoryValidator(true),
  deletSubcategoryValidator,
};
