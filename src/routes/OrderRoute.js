const express = require("express");

const userRoles = require("../config/userRoles");
const allowTo = require("../middleware/allowTomiddleware");
const { protect } = require("../controller/AuthController");

const OrderValidator = require("../utils/validators/OrderValidator");
const OrderController = require("../controller/OrderController");

const router = express.Router();

router.use(protect);
router
  .route("/")
  .post(allowTo(userRoles.USER), OrderController.createOrder)
  .get(
    allowTo(userRoles.USER, userRoles.ADMIN, userRoles.MANGER),
    OrderController.filterOrderForLoggedUser,
    OrderController.findAllOrders
  );

router
  .route("/:id")
  .get(
    allowTo(userRoles.ADMIN, userRoles.MANGER),
    OrderValidator.getUserOrderdValidator,
    OrderController.getUserOrder
  );

router.put(
  "/:id/pay",
  allowTo(userRoles.ADMIN, userRoles.MANGER),
  OrderValidator.updateOrderValidator,
  OrderController.updateOrderToPaid
);

router.put(
  "/:id/deliver",
  allowTo(userRoles.ADMIN, userRoles.MANGER),
  OrderValidator.updateOrderValidator,
  OrderController.updateOrderToDelivered
);

module.exports = router;
