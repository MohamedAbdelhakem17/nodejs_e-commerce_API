const express = require("express");

const userRoles = require("../config/userRoles");
const allowTo = require("../middleware/allowTomiddleware");
const { protect } = require("../controller/AuthController");

const CouponController = require("../controller/CouponController");
const CouponValidator = require("../utils/validators/couponValidator");

const router = express.Router();

router.use(protect, allowTo(userRoles.ADMIN, userRoles.MANGER));

router
  .route("/")
  .get(CouponController.getCoupons)
  .post(CouponValidator.addCouponValidator, CouponController.createCoupon);

router
  .route("/:id")
  .get(CouponController.getCoupons)
  .put(CouponController.updateCoupon)
  .delete(CouponController.deleteCoupon);

module.exports = router;
