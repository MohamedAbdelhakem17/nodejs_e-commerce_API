const mongoose = require("mongoose");
const Product = require("./ProductModel");

const reviewsSchema = new mongoose.Schema(
  {
    titel: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "You must provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be less than or equal to 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name imageProfail",
  });
  next();
});

reviewsSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      $set: {
        ratingsAverage: result[0].avgRatings.toFixed(2),
        ratingsQuantity: result[0].ratingsQuantity,
      },
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      $set: {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
    });
  }
};

reviewsSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewsSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  }
});

const reviewsModel = mongoose.model("Review", reviewsSchema);

module.exports = reviewsModel;
