const express = require("express");

const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deletSubcategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const SubCategoryController = require("../controller/SubCategoryController");

const router = express.Router({ mergeParams: true });




router
  .route("/")
  .post(
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
  .put(updateSubcategoryValidator, SubCategoryController.updateSubCategory)
  .delete(deletSubcategoryValidator, SubCategoryController.deleteSubCategory);

module.exports = router;
