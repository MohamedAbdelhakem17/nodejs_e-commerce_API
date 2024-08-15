const express = require("express");

const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deletSubcategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware.js");

const SubCategoryController = require("../controller/SubCategoryController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    SubCategoryController.setCategoryIdToBody,
    createSubcategoryValidator,
    SubCategoryController.createSubCategory
  )
  .get(
    SubCategoryController.createFilterObj,
    SubCategoryController.getSubCategorys
  );

router
  .route("/:id")
  .get(getSubcategoryValidator, SubCategoryController.getSubCategory)
  .put(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    updateSubcategoryValidator,
    SubCategoryController.updateSubCategory
  )
  .delete(
    AuthController.protect,
    allowTo(userRoles.ADMIN),
    deletSubcategoryValidator,
    SubCategoryController.deleteSubCategory
  );

module.exports = router;
