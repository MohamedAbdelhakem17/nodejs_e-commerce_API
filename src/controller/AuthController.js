const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const UserModel = require("../models/UserModel");
const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");
const { tokenSecretKey } = require("../config/variable");

// generate Token
const generateToken = (payload) =>
  jwt.sign(payload, tokenSecretKey, {
    expiresIn: "1s",
  });

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const user = await UserModel.create(req.body);
  const token = generateToken({ userId: user._id });
  user.token = token;
  await user.save();
  delete user._doc.password;
  delete user._doc.token;
  res.status(200).json({ status: httpStatus.SUCCESS, data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email, active: 1 });

  if (!user)
    throw new AppError(404, httpStatus.FAIL, "This User Does Not Exist");

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword)
    throw new AppError(401, httpStatus.FAIL, "Email or Password is Incorrect");

  const token = generateToken({ userId: user._id });
  user.token = token;
  await user.save();

  delete user._doc.password;
  delete user._doc.token;
  res.status(200).json({ status: httpStatus.SUCCESS, data: user, token });
});

// @desc   make sure the user is logged in
const protect = asyncHandler(async (req, res, next) => {
  //  1 check token exist
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer"))
    throw new AppError(
      401,
      httpStatus.ERROR,
      "You are not login, Please login to get access this route"
    );

  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, tokenSecretKey);

  //   2 check User Exist
  const user = await UserModel.findOne({ _id: decode.userId, active: 1 });
  if (!user)
    throw new AppError(
      404,
      httpStatus.ERROR,
      "The user that belong to this token does no longer exist"
    );

  if (user.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decode.iat)
      throw new AppError(
        401,
        httpStatus.ERROR,
        "User recently changed his password. please login again.."
      );
  }

  req.user = user;
  next();

  console.log(decode);
});
module.exports = {
  signup,
  login,
  protect,
};
// TokenExpiredError
