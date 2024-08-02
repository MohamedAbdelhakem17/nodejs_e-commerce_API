const express = require("express")
const CategoryController = require("../controller/CategoryController")
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deletCategoryValidator } = require("../utils/validators/categoryValidator")
const router = express.Router()

router.route("/")
    .get(CategoryController.getCategorys)
    .post(createCategoryValidator, CategoryController.createCategory)

router.route("/:id")
    .get(getCategoryValidator, CategoryController.getCategory)
    .put(updateCategoryValidator, CategoryController.updateCategory)
    .delete(deletCategoryValidator, CategoryController.deleteCategory)

module.exports = router