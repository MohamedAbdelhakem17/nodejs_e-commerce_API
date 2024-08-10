const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/imageUploadingMiddleware");
const BrandModel = require("../models/BrandModel");

// image Upload
const imageBrandUpload = uploadSingleImage("image");
const imageManipulation = async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
};

// @desc   Get List Of Brand
// @route  GET  api/v1/brand
// @access Public
const getBrands = Factory.getAll(BrandModel);

//  @desc   Get Spesific Brand
//  @route  GET / api/v1/brand/:id
// @access  Public
const getBrand = Factory.getOne(BrandModel);

//  @desc   Create New Brand
//  @route  Post  api/v1/brand
//  @access Private
const createBrand = Factory.createOne(BrandModel);

//  @desc   Update Brand
//  @route  Put  api/v1/Brand/:id
//  @access Private
const updateBrand = Factory.updateOne(BrandModel);

//  @desc   Delete Brand
//  @route  Delete  api/v1/brand/:id
//  @access Private
const deleteBrand = Factory.deleteOne(BrandModel);

module.exports = {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  imageBrandUpload, 
  imageManipulation
};
