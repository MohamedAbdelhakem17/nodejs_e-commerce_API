const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const getBrandValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

const brandValidator = (isUpdate) => [
  check("id")
    .if(() => isUpdate)
    .isMongoId()
    .withMessage("This Is Not Valid Mongo Id"),
  check("name")
    .optional(isUpdate)
    .trim()
    .notEmpty()
    .withMessage("You Must Insert Brand Name")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deletBrandValidator = [
  check("id").isMongoId().withMessage("This Is Not Valid Mongo Id"),
  validatorMiddleware,
];

module.exports = {
  getBrandValidator,
  createBrandValidator:brandValidator(false),
  updateBrandValidator:brandValidator(true), 
  deletBrandValidator,
};
