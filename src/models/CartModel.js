const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
      required: [true, "User reference is required"],
    },
    totalPrice: {
      type: Number,
      // required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    totalPriceAfterDiscount: {
      type: Number,
      min: [0, "Total price after discount cannot be negative"],
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
