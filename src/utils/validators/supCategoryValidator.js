const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware")


const getSupcategoryValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    validatorMiddleware
];

const createSupcategoryValidator = [
    check("name")
        .trim()
        .notEmpty().withMessage("You Must Insert Category Name")
        .isLength({ min: 2, max: 32 })
        .withMessage('Sup Category must be between 2 and 32 characters long'),
    check("category")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    validatorMiddleware
];

const updateSupcategoryValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    check("name")
        .trim()
        .notEmpty().withMessage("You Must Insert Category Name")
        .isLength({ min: 2, max: 32 }),
    check("category")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id")
        .withMessage('Sup Category must be between 2 and 32 characters long'),
    validatorMiddleware
];

const deletSupcategoryValidator = [
    check("id")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id"),
    validatorMiddleware
];



module.exports = {
    getSupcategoryValidator, createSupcategoryValidator, updateSupcategoryValidator, deletSupcategoryValidator
}