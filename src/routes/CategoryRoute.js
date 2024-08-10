const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deletCategoryValidator,
} = require("../utils/validators/categoryValidator");

const CategoryController = require("../controller/CategoryController");

const router = express.Router();

// Nested Route
const subcategoriesRoute = require("./SubCategoryRoute");

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(CategoryController.getCategorys)
  .post(
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    createCategoryValidator,
    CategoryController.createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, CategoryController.getCategory)
  .put(
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    updateCategoryValidator,
    CategoryController.updateCategory
  )
  .delete(deletCategoryValidator, CategoryController.deleteCategory);

module.exports = router;
