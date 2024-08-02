const express = require("express");
const {
    getSupcategoryValidator,
    createSupcategoryValidator,
    updateSupcategoryValidator,
    deletSupcategoryValidator,
} = require("../utils/validators/supCategoryValidator");

const SupCategoryController = require("../controller/SupCategoryController");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .post(SupCategoryController.setCategoryIdToBody, createSupcategoryValidator, SupCategoryController.createSupCategory)
    .get(SupCategoryController.createFilterObj, SupCategoryController.getSupCategorys)

router
    .route("/:id")
    .get(getSupcategoryValidator, SupCategoryController.getSupCategory)
    .put(updateSupcategoryValidator, SupCategoryController.updateSupCategory)
    .delete(deletSupcategoryValidator, SupCategoryController.deleteSupCategory);

module.exports = router;
