const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deletCategoryValidator,
} = require("../utils/validators/categoryValidator");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware.js");
const CategoryController = require("../controller/CategoryController");

const router = express.Router();

// Nested Route
const subcategoriesRoute = require("./SubCategoryRoute");

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(CategoryController.getCategorys)
  .post(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    createCategoryValidator,
    CategoryController.createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, CategoryController.getCategory)
  .put(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    updateCategoryValidator,
    CategoryController.updateCategory
  )
  .delete(
    AuthController.protect,
    allowTo(userRoles.ADMIN),
    deletCategoryValidator,
    CategoryController.deleteCategory
  );

module.exports = router;
