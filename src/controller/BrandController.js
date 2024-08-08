const Factory = require("./handlersFactory");
const BrandModel = require("../models/BrandModel");

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
};

// const createCategory = (req, res) => {
//     const { name } = req.body
//     let slug = name.includes(" ")
//         ? name.trim.replaceAll(" ", "-").toLowerCase()
//         : name.toLowerCase();

//     CategoryModel.create({ name, slug, image: "" })
//         .then(createdDocument => {
//             const result = createdDocument.toObject();
//             delete result.__v
//             return result
//         })
//         .then(cat => {
//             res.status(201).json({ status: "ok", data: cat })
//         })
//         .catch(err => {
//             res.status(400).json({ status: "fail", data: err.message })
//         })
// }
