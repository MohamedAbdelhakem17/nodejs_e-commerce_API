const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userRoles = require("../config/userRoles");
const { host } = require("../config/variable");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You must insert User Name"],
      minlength: [3, "Name must contain at least 3 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: [true, "This Email is already used"],
      required: [true, "You must insert User Email"],
    },

    password: {
      type: String,
      required: [true, "You must insert User Password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    passwordChangedAt: Date,
    resetPasswordCode: String,
    resetPasswordExpire: Date,
    passwordVerify: Boolean,

    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: [userRoles.ADMIN, userRoles.USER],
      default: userRoles.USER,
    },

    token: String,
    imageProfail: String,
    phone: String,

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: {
          type: String,
          unique: [true, "You already added this address"],
          trim: true,
        },
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  
  { timestamps: true }
);

// hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// set Image URL
userSchema.post(["init", "save"], (doc) => {
  if (doc.imageProfail) {
    const newName = `${host}/users/${doc.imageProfail}`;
    doc.imageProfail = newName;
  }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
