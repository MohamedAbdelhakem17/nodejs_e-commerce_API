const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const getCategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

const CategoryValidator = (isUpdate) => [
  check("id")
    .if(() => isUpdate)
    .isMongoId()
    .withMessage("This Is Not Valid Mongo Id"),
  check("name")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("You Must Insert Category Name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deletCategoryValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator: CategoryValidator(false),
  updateCategoryValidator: CategoryValidator(true),
  deletCategoryValidator,
};
