const mongoose = require("mongoose");
const { paymentMethod, orderStatus } = require("../config/orderOptions");

const orderSchema = new mongoose.Schema(
  {
    cartItem: [
      {
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"],
        },
        color: {
          type: String,
          required: [true, "Color is required"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
        size: {
          type: String,
          required: false,
          default: null,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product reference is required"],
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      min: [1, "Total Price must be more than 0"],
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: [paymentMethod.CARD, paymentMethod.CASH],
      default: paymentMethod.CASH,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentAt: {
      type: Date,
      default: null,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: [
        orderStatus.ARRIVED,
        orderStatus.CANCELED,
        orderStatus.PENDING,
        orderStatus.TO_ARRIVE,
      ],
      default: orderStatus.PENDING,
    },
    shippingAddress: {
      id: { type: mongoose.Schema.Types.ObjectId },
      alias: {
        type: String,
        trim: true,
      },
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
