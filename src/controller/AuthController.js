const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const { tokenSecretKey } = require("../config/variable");
const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/createToken");
const UserModel = require("../models/UserModel");

// encoded Reset Code
const encodedResetCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

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
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
    throw new AppError(
      401,
      httpStatus.ERROR,
      "You are not login, Please login to get access this route"
    );
  }

  const token = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(token, tokenSecretKey);

  const user = await UserModel.findOne({ _id: decode.userId, active: 1 });
  if (!user) {
    throw new AppError(
      404,
      httpStatus.ERROR,
      "The user that belong to this token does no longer exist"
    );
  }

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
});

// @desc    Forgot Password
// @route   Post /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user)
    throw new AppError(404, httpStatus.FAIL, "This User Does Not Exist");

  const resetCode = String(Math.round(100000 + Math.random() * 99999));
  const encodedCode = encodedResetCode(resetCode);
  user.resetPasswordCode = encodedCode;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  const emailOptions = {
    mailTo: email,
    subject: "Password Reset Request",
    html: `
      <div
        style="font-family: Arial, sans-serif;  line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center;">Password Reset Request</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>We received a request to reset your password for your account. If you did not request a password reset,
          please
          disregard this email.</p>
        <p>To reset your password, please use the following code:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span
            style="display: inline-block; padding: 10px 30px; font-size: 24px; color: #fff; background-color: #007bff; border-radius: 5px;">${resetCode}</span>
        </div>
        <p style="color: #d9534f; font-weight: bold; text-align: center;">Please note that this code is valid for only
          10 minutes.</p>
        <p>Enter this code on the password reset page to create a new password for your account.</p>
        <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
        <p style="margin-top: 40px;">Best regards</p>
      </div>
    `,
  };

  await user.save();
  try {
    await sendEmail(emailOptions);
    res
      .status(200)
      .json({ status: httpStatus.SUCCESS, data: "Email Sent Successfully" });
  } catch (error) {
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new AppError(500, httpStatus.FAIL, "Email Could Not Be Sent");
  }
});

// @desc    verify Password Code
// @route   Post /api/v1/auth/verifyPassResetCode
// @access  Public
const verifyPassResetCode = asyncHandler(async (req, res) => {
  const { resetCode } = req.body;
  const encodedCode = encodedResetCode(resetCode);

  const user = await UserModel.findOne({
    resetPasswordCode: encodedCode,
  });

  if (!user || user.passwordVerify) {
    throw new AppError(
      404,
      httpStatus.FAIL,
      "Invalid or already used reset code."
    );
  }

  if (user.resetPasswordExpire < Date.now()) {
    throw new AppError(400, httpStatus.FAIL, "This reset code has expired.");
  }

  user.passwordVerify = true;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: "Reset code verified successfully.",
  });
});

// @desc    reset Password
// @route   put /api/v1/auth/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user)
    throw new AppError(
      404,
      httpStatus.FAIL,
      `There is no user with email ${email}`
    );

  if (!user.passwordVerify)
    throw new AppError(400, httpStatus.FAIL, "Reset code not verified");

  user.password = password;
  user.passwordVerify = undefined;

  await user.save();

  const token = generateToken({ userId: user._id });
  res.status(200).json({ status: httpStatus.SUCCESS, token });
});

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
};
