const express = require("express");

const userRoles = require("../config/userRoles");
const AuthController = require("../controller/AuthController");
const allowTo = require("../middleware/allowTomiddleware");

const CartValidator = require("../utils/validators/cartValidator");
const CartController = require("../controller/CartController");

const router = express.Router();

router.use(AuthController.protect, allowTo(userRoles.USER));
router
  .route("/")
  .get(CartController.getUserCart)
  .post(
    CartValidator.addProductToCartValidator,
    CartController.addProductToCart
  );

router
  .route("/item/:itemId")
  .put(
    CartValidator.updateProductQuantityInCartValidator,
    CartController.updateCartItemQuantity
  )
  .delete(CartController.removeItemFromCart);

router.delete("/:cartId", CartController.deleteUserCart);

router.put("/applyCoupon", CartController.applyCouponToUserCart);
module.exports = router;
