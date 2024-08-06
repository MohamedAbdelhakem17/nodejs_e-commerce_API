const express = require("express")

const ProductController = require("../controller/ProductController")
const ProductValidator = require("../utils/validators/ProductValidator")

const router = express.Router()

router.route("/")
    .get(ProductController.getProducts)
    .post(ProductValidator.createProductValidator, ProductController.createNewProduct)

router.route("/:id")
    .get(ProductValidator.getProductValidator, ProductController.getProduct)
    .put(ProductValidator.updateProductValidator, ProductController.updateProduct)
    .delete(ProductValidator.deleteProductValidator, ProductController.deleteProduct)



module.exports = router