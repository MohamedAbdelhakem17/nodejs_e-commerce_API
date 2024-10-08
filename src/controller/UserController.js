const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const { uploadSingleImage } = require("../middleware/imageUploadingMiddleware");
const Factory = require("./handlersFactory");
const httpStatus = require("../config/httpStatus");
const AppError = require("../utils/customError");
const generateToken = require("../utils/createToken");

const UserModel = require("../models/UserModel");

// handel image upload
const userImageUpload = uploadSingleImage("imageProfail");
const imageManipulation = async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    req.body.imageProfail = filename;
  }
  next();
};

//  @desc   Get All User
//  @route  get   api/v1/users
//  @access private
const getUsers = Factory.getAll(UserModel);

//  @desc   Get one User
//  @route  get   api/v1/users/:id
//  @access private
const getUser = Factory.getOne(UserModel);

//  @desc   Create New User
//  @route  Post   api/v1/user
//  @access private
const createUser = Factory.createOne(UserModel);

//  @desc  Update  User
//  @route  Put   api/v1/user:id
//  @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, imageProfail, phone, email, role, slug } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      name,
      imageProfail,
      phone,
      email,
      role,
      slug,
    },
    { new: true }
  );
  if (!user)
    throw new AppError(404, httpStatus.FAIL, `No User For This id ${id}`);
  res.status(201).json({ status: httpStatus.SUCCESS, data: user });
});

//  @desc   delete  User
//  @route  put   api/v1/user/delete/:id
//  @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOneAndUpdate(
    { _id: id, active: 1 },
    { $set: { active: 0 } },
    { new: true }
  );
  if (!user)
    throw new AppError(404, httpStatus.FAIL, `No User For This id ${id}`);
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

//  @desc   Reset password  User
//  @route  put   api/v1/user/changePassword/:id"
//  @access private
const changePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        password: await bcrypt.hash(password, 12),
        passwordChangedAt: Date.now(),
      },
    },
    { new: true }
  );
  if (!user) {
    throw new AppError(404, httpStatus.FAIL, `No user found for this id ${id}`);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: user });
});

//  @desc   get Looged User Data
//  @route  get   api/v1/user/getme"
//  @access private/protect
const getLoogedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//  @desc   Reset Logged User password
//  @route  put   api/v1/user/updateMyPassword"
//  @access private/protect
const updataLoogedUserPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const id = req.user._id;
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        password: await bcrypt.hash(password, 12),
        passwordChangedAt: Date.now(),
      },
    },
    { new: true, select: "name email role" }
  );

  if (!user) {
    throw new AppError(404, httpStatus.FAIL, `No user found for this id ${id}`);
  }

  const token = generateToken({ userId: user._id });
  res.status(200).json({ status: httpStatus.SUCCESS, data: user, token });
});

//  @desc  Update Logged User Data
//  @route  put   api/v1/user/updateMyData"
//  @access private/protect
const updataLoogedUserData = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { name, imageProfail, phone, email, slug } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      name,
      imageProfail,
      phone,
      email,
      slug,
    },
    { new: true, select: "name phone , email , imageProfail" }
  );
  if (!user)
    throw new AppError(404, httpStatus.FAIL, `No User For This id ${id}`);
  res.status(201).json({ status: httpStatus.SUCCESS, data: user });
});

//  @desc   delete  User
//  @route  delete  api/v1/user/deleteMe
//  @access private
const deleteMe = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await UserModel.findOneAndUpdate(
    { _id: id, active: 1 },
    { $set: { active: 0 } },
    { new: true }
  );
  if (!user)
    throw new AppError(404, httpStatus.FAIL, `No User For This id ${id}`);
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userImageUpload,
  imageManipulation,
  changePassword,
  getLoogedUserData,
  updataLoogedUserPassword,
  updataLoogedUserData,
  deleteMe,
};
