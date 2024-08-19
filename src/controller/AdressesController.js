const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");

const UserModel = require("../models/UserModel");

//  @desc   get Logged User Address
//  @route  grt  api/v1/address
//  @access Protet/user
const getLoggedUserAddresses = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.addresses });
});

//  @desc   Add user Address
//  @route  post  api/v1/address
//  @access Protet/user
const addAddress = asyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.addresses });
});

//  @desc   update User Address
//  @route  put  api/v1/address/:addressId
//  @access Protet/user
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const updatedAddress = req.body;

  const user = await UserModel.findOneAndUpdate(
    { _id: req.user._id, "addresses._id": addressId },
    { $set: { "addresses.$": updatedAddress } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError(404, httpStatus.FAIL, "User or Address Not Found");
  }

  res.status(200).json({ status: httpStatus.SUCCESS, data: user.addresses });
});

//  @desc   delete User Address
//  @route  delete  api/v1/address/:addressId
//  @access Protet/user
const removeAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.addresses });
});

module.exports = {
  getLoggedUserAddresses,
  addAddress,
  removeAddress,
  updateAddress,
};
