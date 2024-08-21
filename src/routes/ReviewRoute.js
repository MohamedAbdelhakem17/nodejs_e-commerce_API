const express = require("express");

const allowTo = require("../middleware/allowTomiddleware");
const userRoles = require("../config/userRoles");

const AuthController = require("../controller/AuthController");
const ReviewsValidator = require("../utils/validators/reviewsValidator");
const ReviewsController = require("../controller/ReviewsController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(ReviewsController.createFilterObject, ReviewsController.getAllReviews)
  .post(
    AuthController.protect,
    allowTo(userRoles.USER),
    ReviewsController.setProductIdToBody,
    ReviewsValidator.createReviewValidator,
    ReviewsController.createReview
  );

router
  .route("/:id")
  .get(ReviewsController.getReview)
  .put(
    AuthController.protect,
    allowTo(userRoles.USER),
    ReviewsValidator.updateReviewValidator,
    ReviewsController.updateReview
  )
  .delete(
    AuthController.protect,
    allowTo(userRoles.USER, userRoles.ADMIN, userRoles.MANGER),
    ReviewsValidator.deleteReviewValidator,
    ReviewsController.deleteReview
  );

module.exports = router;
