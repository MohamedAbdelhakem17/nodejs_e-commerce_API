const mongoose = require("mongoose");
const { host } = require("../config/variable");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You must insert a Brand name"],
      unique: [true, "Brand must be unique"],
      minlength: [2, "Brand name must be more than 2 characters"],
      maxlength: [32, "Brand name must be less than 32 characters"],
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
    const imageUrl = `${host}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
