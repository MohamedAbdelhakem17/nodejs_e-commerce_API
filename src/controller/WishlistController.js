const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");

const UserModel = require("../models/UserModel");

//  @desc   get Logged User Wish list
//  @route  grt  api/v1/wishlist
//  @access Protet/user
const getLoggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate({
    path: "wishlist",
    select:"title imageCover slug description price"
  });
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

//  @desc   Add Product To Wish list
//  @route  post  api/v1/wishlist
//  @access Protet/user
const addToWishList = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

//  @desc   delete Product From Wish list
//  @route  Get  api/v1/wishlis:productId
//  @access Protet/user
const removeFromWishList = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

module.exports = { getLoggedUserWishlist, addToWishList, removeFromWishList };
