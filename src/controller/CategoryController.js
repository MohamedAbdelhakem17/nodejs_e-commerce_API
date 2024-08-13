const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/imageUploadingMiddleware");
const CategoryModel = require("../models/CategoryModel");

// handel image upload
const imageCategoryUpload = uploadSingleImage("image");
const imageManipulation = async (req, res, next) => {
  console.log(req.body)
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
};

// @desc   Get List Of category
// @route  GET  api/v1/category
// @access Public
const getCategorys = Factory.getAll(CategoryModel);

//  @desc   Get Spesific category
//  @route  GET / api/v1/category/:id
// @access  Public
const getCategory = Factory.getOne(CategoryModel);

//  @desc   Create New category
//  @route  Post  api/v1/category
//  @access Private
const createCategory = Factory.createOne(CategoryModel);

//  @desc   Update category
//  @route  Put  api/v1/category/:id
//  @access Private
const updateCategory = Factory.updateOne(CategoryModel);

//  @desc   Delete category
//  @route  Delete  api/v1/category/:id
//  @access Private
const deleteCategory = Factory.deleteOne(CategoryModel);

module.exports = {
  getCategorys,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  imageManipulation,
  imageCategoryUpload,
};
