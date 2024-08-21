const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      trim: true,
      required: [true, "Please provide a name for the coupon."],
      unique: [
        true,
        "A coupon with this name already exists. Please choose a different name.",
      ],
    },
    expired: {
      type: Date,
      required: [true, "Please provide an expiration date for the coupon."],
    },
    discount: {
      type: Number,
      required: [true, "Please provide a discount amount for the coupon."],
      min: [
        0,
        "Discount cannot be less than 0. Please provide a valid discount amount.",
      ],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model("Coupon", couponSchema);

module.exports = CouponModel;
