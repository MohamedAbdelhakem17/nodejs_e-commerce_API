const express = require("express")

const ProductController = require("../controller/ProductController")
const ProductValidator = require("../utils/validators/ProductValidator")

const router = express.Router()

router.route("/")
    .get(ProductController.getProducts)
    .post(ProductValidator.createProductValidator, ProductController.createNewProduct)

router.route("/:id")
    .get(ProductController.getProduct)
    .put(ProductController.updateProduct)
    .delete(ProductController.deleteProduct)



module.exports = router