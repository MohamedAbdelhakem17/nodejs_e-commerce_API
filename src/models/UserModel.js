const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

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
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: [userRoles.ADMIN, userRoles.USER],
      default: userRoles.USER,
    },
    imageProfail: String,
    phone: String,
  },
  { timestamps: true }
);

// hash Password
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  }
  next();
});

// set image Url
const setUserImage = (doc) => {
  if (doc.imageProfail) {
    const newName = `${host}/users/${doc.imageProfail}`;
    doc.imageProfail = newName;
  }
};

userSchema.post("save", (doc) => setUserImage(doc));
userSchema.post("init", (doc) => setUserImage(doc));

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
