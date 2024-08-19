const express = require("express");

const userRoles = require("../config/userRoles");
const allowTo = require("../middleware/allowTomiddleware");
const { protect } = require("../controller/AuthController");

const wishListValidator = require("../utils/validators/wishListValidator");
const WishlistController = require("../controller/WishlistController");

const router = express.Router();

router.use(protect, allowTo(userRoles.USER));
router
  .route("/")
  .post(
    wishListValidator.addToWishListValidator,
    WishlistController.addToWishList
  )
  .get(WishlistController.getLoggedUserWishlist);
router.delete("/:productId", WishlistController.removeFromWishList);
module.exports = router;
