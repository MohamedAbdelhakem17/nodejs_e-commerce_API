const { check } = require("express-validator");
const CategoryModel = require("../../models/CategoryModel")
const subategoryModel = require("../../models/SubCategoryModel")
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const createProductValidator = [
    check("category")
        .trim()
        .notEmpty().withMessage('Product must be belong to a category')
        .isMongoId().withMessage("This Is Not Valid Mongo Id")
        .custom(async (id) => {
            const category = await CategoryModel.findById(id)
            if (!category) throw new Error(`No category for this id: ${id}`)
        }),
    check("subCategorys")
        .optional()
        .isArray()
        .isMongoId().withMessage("This Is Not Valid Mongo Id")
        // Check subcategory exist in the database
        .custom(async (subcategoriesIds) => {
            const subCategoriesIdsInDB = await subategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } })
            if (subCategoriesIdsInDB.length > 1 || subCategoriesIdsInDB.length !== subcategoriesIds.length)
                throw new Error(`Invalid subcategories Ids`)
        })
        // Check subcategory belongos to same category
        .custom(async (value, { req }) => {
            const subCategorys = await subategoryModel.find({ category: req.body.category })
            const subcategorysIds = subCategorys.map(subcategory => subcategory._id.toString())
            const checker = value.every(v => subcategorysIds.includes(v))
            if (!checker) throw new Error(`subcategories not belong to category`)
        }),
    validatorMiddleware
];

module.exports = {
    createProductValidator,
};
