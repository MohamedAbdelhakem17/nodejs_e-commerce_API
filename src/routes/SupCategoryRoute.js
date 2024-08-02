const express = require("express")
const { getSupcategoryValidator, createSupcategoryValidator, updateSupcategoryValidator, deletSupcategoryValidator } = require("../utils/validators/supCategoryValidator")

const SupCategoryController = require("../controller/SupCategoryController")

const router = express.Router()

router.route("/")
    .get(SupCategoryController.getSupCategorys)
    .post(createSupcategoryValidator, SupCategoryController.createSupCategory)

router.route("/:id")
    .get(getSupcategoryValidator, SupCategoryController.getSupCategory)
    .put(updateSupcategoryValidator, SupCategoryController.updateSupCategory)
    .delete(deletSupcategoryValidator, SupCategoryController.deleteSupCategory)



module.exports = router