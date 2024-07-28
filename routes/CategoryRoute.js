const express = require("express")
const CategoryController = require("../controller/CategoryController")
const router = express.Router()

router.route("/")
    .get(CategoryController.getCategory)

module.exports = router