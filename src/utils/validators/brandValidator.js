const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware")

const getBrandValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    validatorMiddleware
];

const createBrandValidator = [
    check("name")
        .trim()
        .notEmpty().withMessage("You Must Insert Brand Name")
        .isLength({ min: 3, max: 32 })
        .withMessage('Brand name must be between 3 and 32 characters long'),
    validatorMiddleware
];

const updateBrandValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    check("name")
        .trim()
        .notEmpty().withMessage("You Must Insert Brand Name")
        .isLength({ min: 3, max: 32 })
        .withMessage('Brand name must be between 3 and 32 characters long'),
    validatorMiddleware
];

const deletBrandValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    validatorMiddleware
];



module.exports = {
    getBrandValidator, createBrandValidator, updateBrandValidator, deletBrandValidator
}