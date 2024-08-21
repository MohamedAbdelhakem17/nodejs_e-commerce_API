const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deletBrandValidator,
} = require("../utils/validators/brandValidator");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware");

const BrandController = require("../controller/BrandController");

const router = express.Router();

router
  .route("/")
  .get(BrandController.getBrands)
  .post(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    BrandController.imageBrandUpload,
    BrandController.imageManipulation,
    createBrandValidator,
    BrandController.createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, BrandController.getBrand)
  .put(
    AuthController.protect,
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    BrandController.imageBrandUpload,
    BrandController.imageManipulation,
    updateBrandValidator,
    BrandController.updateBrand
  )
  .delete(
    AuthController.protect,
    allowTo(userRoles.ADMIN),
    deletBrandValidator,
    BrandController.deleteBrand
  );

module.exports = router;
