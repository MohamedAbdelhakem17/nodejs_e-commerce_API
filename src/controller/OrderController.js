const asyncHandler = require("express-async-handler");

const Factory = require("./handlersFactory");
const httpStatus = require("../config/httpStatus");
const userRoles = require("../config/userRoles");
const AppError = require("../utils/customError");

const ProductModel = require("../models/ProductModel");
const CartModel = require("../models/CartModel");
const OrderModel = require("../models/OrderModel");

const filterOrderForLoggedUser = (req, res, next) => {
  if (req.user.role === userRoles.USER)
    req.body.filterObj = { user: req.user._id };
  next();
};
// @desc    get User order
// @route   Post api/v1/order/:id
// @access  protect/admin-manger-user
const findAllOrders = Factory.getAll(OrderModel);

// @desc    get User order
// @route   Post api/v1/order/:id
// @access  protect/admin-manger
const getUserOrder = Factory.getOne(OrderModel);

// @desc    Create New order
// @route   Post api/v1/order
// @access  protect/user
const createOrder = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const cart = await CartModel.findOne({ user });

  if (!cart) {
    throw new AppError(404, httpStatus.FAIL, "This user does not have a cart");
  }

  const totalPrice = cart.totalPriceAfterDiscount || cart.totalPrice;

  const order = await OrderModel.create({
    user,
    totalPrice,
    cartItem: cart.cartItem,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    const bulkOptions = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            sold: item.quantity,
            quantity: -item.quantity,
          },
        },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions);
    await CartModel.findOneAndDelete({ user });
  }

  res.status(201).json({ status: httpStatus.SUCCESS, data: order });
});

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { $set: { isPaid: true, paymentAt: Date.now() } },
    { new: true }
  );
  if (!order) {
    throw new AppError(404, httpStatus.FAIL, `Order with ID ${id} not found.`);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: order });
});

// @desc    Update order delivery status to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager 
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { $set: { isDelivered: true, deliveredAt: Date.now() } },
    { new: true }
  );
  if (!order) {
    throw new AppError(404, httpStatus.FAIL, `Order with ID ${id} not found.`);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: order });
});

module.exports = {
  createOrder,
  getUserOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
};
