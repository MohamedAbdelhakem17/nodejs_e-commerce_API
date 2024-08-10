const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const CategoryModel = require("../../models/CategoryModel");

const getSubcategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

const createSubcategoryValidator = [
  check("name")
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
    .isMongoId()
    .withMessage("This Is Not Valid Mongo Id")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) throw new Error("Category does not exist");
      else return true
    }),
  validatorMiddleware,
];

const updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deletSubcategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

module.exports = {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deletSubcategoryValidator,
};
