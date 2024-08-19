const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../models/UserModel");

const addressValidator = (isUpdate) => [
  check("addressId")
    .if(() => isUpdate)
    .notEmpty()
    .withMessage("Address ID is required.")
    .isMongoId()
    .withMessage("This is not a valid MongoDB ID.")
    .custom(async (id, { req }) => {
      const existingUser = await UserModel.findOne({
        _id: req.user._id,
        addresses: { $elemMatch: { _id: id } },
      });

      if (!existingUser) {
        throw new Error("This address does not exist.");
      }
      return true;
    }),

  check("alias")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Alias must be between 2 and 20 characters.")
    .custom(async (alias, { req }) => {
      if (alias) {
        const existingUser = await UserModel.findOne({
          _id: req.user._id,
          addresses: { $elemMatch: { alias: alias } },
        });
        if (existingUser) {
          throw new Error("Alias already exists in the database.");
        }
      }
      return true;
    }),

  check("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage("This is not a valid phone number."),

  check("details")
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Details are required."),

  validatorMiddleware,
];


const deleteValidator = [
  check("addressId")
  .notEmpty()
  .withMessage("Address ID is required.")
  .isMongoId()
  .withMessage("This is not a valid MongoDB ID.")
  .custom(async (id, { req }) => {
    const existingUser = await UserModel.findOne({
      _id: req.user._id,
      addresses: { $elemMatch: { _id: id } },
    });

    if (!existingUser) {
      throw new Error("This address does not exist.");
    }
    return true;
  }),
  validatorMiddleware
]

module.exports = {
  addAddressValidator: addressValidator(false),
  updateAddressValidator: addressValidator(true),
  deleteValidator
};
