const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const OrderModel = require("../../models/OrderModel");

const getUserOrderdValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB ID provided."),
  validatorMiddleware,
];

const updateOrderValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid MongoDB ID provided.")
    .custom(async (orderId) => {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error(
          `No order found with ID: ${orderId}. Please provide a valid order ID.`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  updateOrderValidator,
  getUserOrderdValidator,
};
