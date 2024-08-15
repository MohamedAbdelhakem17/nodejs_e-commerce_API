const express = require("express");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware.js");

const ProductController = require("../controller/ProductController");
const ProductValidator = require("../utils/validators/ProductValidator");

const router = express.Router();

router
  .route("/")
  .get(ProductController.getProducts)
  .post(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    ProductController.productImagesUpload,
    ProductController.imageManipulation,
    ProductValidator.createProductValidator,
    ProductController.createNewProduct
  );

router
  .route("/:id")
  .get(ProductValidator.getProductValidator, ProductController.getProduct)
  .put(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    ProductController.productImagesUpload,
    ProductController.imageManipulation,
    ProductValidator.updateProductValidator,
    ProductController.updateProduct
  )
  .delete(
    AuthController.protect,
    allowTo(userRoles.ADMIN),
    ProductValidator.deleteProductValidator,
    ProductController.deleteProduct
  );

module.exports = router;
