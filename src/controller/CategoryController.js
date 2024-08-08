const Factory = require("./handlersFactory");
const CategoryModel = require("../models/CategoryModel");

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
};
