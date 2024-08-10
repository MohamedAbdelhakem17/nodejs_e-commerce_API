const mongoose = require("mongoose");
const { host } = require("../config/variable");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You must insert a category name"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Category name must be more than 3 characters"],
      maxlength: [32, "Category name must be less than 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${host}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  setImageURL(doc);
});

CategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
