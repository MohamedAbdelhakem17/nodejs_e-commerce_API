const express = require("express")
const { getSupcategoryValidators, getSupcategoryValidator, createSupcategoryValidator, updateSupcategoryValidator, deletSupcategoryValidator } = require("../utils/validators/supCategoryValidator")

const SupCategoryController = require("../controller/SupCategoryController")

const router = express.Router()

router.route("/")
    .post(createSupcategoryValidator, SupCategoryController.createSupCategory)

router.route("/:id")
    .get(getSupcategoryValidators, SupCategoryController.getSupCategorys)
    .get(getSupcategoryValidator, SupCategoryController.getSupCategory)
    .put(updateSupcategoryValidator, SupCategoryController.updateSupCategory)
    .delete(deletSupcategoryValidator, SupCategoryController.deleteSupCategory)



module.exports = router