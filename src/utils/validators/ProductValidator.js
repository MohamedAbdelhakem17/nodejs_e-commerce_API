const { check, body } = require("express-validator");
const slugify = require("slugify");
const CategoryModel = require("../../models/CategoryModel");
const subategoryModel = require("../../models/SubCategoryModel");
const brandModel = require("../../models/BrandModel");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const createProductValidator = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "title must be at least 3 characters and no more than 100 characters"
        ),

    check("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),

    check("price")
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
        // Check price after discount is less than or equal to price
        .custom((value, { req }) => {
            if (value <= req.body.price)
                throw new Error(
                    "Price after discount must be less than or equal to price"
                );
        }),

    check("colors")
        .optional()
        .isArray()
        .withMessage("availableColors should be array of string"),

    check("imageCover").trim().notEmpty().withMessage("Image cover is required"),

    check("images")
        .optional()
        .isArray()
        .withMessage("images should be array of string"),

    check("category")
        .trim()
        .notEmpty()
        .withMessage("Product must be belong to a category")
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id")
        // Check category exist in the database
        .custom(async (id) => {
            const category = await CategoryModel.findById(id);
            if (!category) throw new Error(`No category for this id: ${id}`);
        }),

    check("subCategorys")
        .optional()
        .isArray()
        .isMongoId()
        .withMessage("This Is Not Valid Mongo Id")
        // Check subcategory exist in the database
        .custom(async (subcategoriesIds) => {
            const subCategoriesIdsInDB = await subategoryModel.find({
                _id: { $exists: true, $in: subcategoriesIds },
            });
            if (
                subCategoriesIdsInDB.length > 1 ||
                subCategoriesIdsInDB.length !== subcategoriesIds.length
            )
                throw new Error(`Invalid subcategories Ids`);
        })
        // Check subcategory belongos to same category
        .custom(async (value, { req }) => {
            const subCategorys = await subategoryModel.find({
                category: req.body.category,
            });
            const subcategorysIds = subCategorys.map((subcategory) =>
                subcategory._id.toString()
            );
            const checker = value.every((v) => subcategorysIds.includes(v));
            if (!checker) throw new Error(`subcategories not belong to category`);
        }),

    check("brand")
        .optional()
        .isMongoId()
        .withMessage("This is not a valid mongo id")
        // Check Brand exist in the database
        .custom(async (value) => {
            const brand = await brandModel.findById(value);
            if (!brand) throw new Error(`No category for this id: ${value}`);
        }),
    check("ratingsAverage")
        .isNumeric()
        .withMessage("reatings average must be a number")
        // Check average rating between 1 and 5
        .custom((value) => {
            const checkFlag = value < 1 || value > 5;
            if (checkFlag)
                throw new Error(`rating average must be between 1.0 and 5.0 `);
        }),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingsQuantity must be a number"),
    validatorMiddleware,
];

const getProductValidator = [
    check('id').isMongoId().withMessage('This is not avalid mongo id'),
    validatorMiddleware,
];

const updateProductValidator = [
    check('id').isMongoId().withMessage('This is not avalid mongo id'),
    body('title')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

const deleteProductValidator = [
    check('id').isMongoId().withMessage('This is not avalid mongo id'),
    validatorMiddleware,
];

module.exports = {
    createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator
};
