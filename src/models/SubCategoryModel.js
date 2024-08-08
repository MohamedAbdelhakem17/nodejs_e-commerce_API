const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You must insert Sub Category Name"],
      minlength: [2, "Sub category name must be great than 2 char"],
      maxlength: [32, "Sub category name must be less than 32 char"],
      unique: [true, "Category must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Must insert Category ID"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const SubCategoryModel = mongoose.model("Subcategory", subCategorySchema);
module.exports = SubCategoryModel;
