const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deletBrandValidator,
} = require("../utils/validators/brandValidator");
const BrandController = require("../controller/BrandController");

const router = express.Router();

router
  .route("/")
  .get(BrandController.getBrands)
  .post(
    BrandController.imageBrandUpload,
    BrandController.imageManipulation,
    createBrandValidator,
    BrandController.createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, BrandController.getBrand)
  .put(
    BrandController.imageBrandUpload,
    BrandController.imageManipulation,
    updateBrandValidator,
    BrandController.updateBrand
  )
  .delete(deletBrandValidator, BrandController.deleteBrand);

module.exports = router;
