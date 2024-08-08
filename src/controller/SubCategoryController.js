const Factory = require("./handlersFactory");
const SubCategoryModel = require("../models/SubCategoryModel");

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
const createFilterObj = (req, res, next) => {
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};

  req.filterObj = filterObject;
  next();
};

//  @desc   Create New sub categories
//  @route  Get  api/v1/subcategories/:id
//  @access public
const getSubCategorys = Factory.getAll(SubCategoryModel);

//  @desc   Create New sub categories
//  @route  Get  api/v1/Subcategory/:id
//  @access public
const getSubCategory = Factory.getOne(SubCategoryModel);

// Post /api/v1/categories/:categoryId/subcategories
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//  @desc   Create New sub categories
//  @route  Post  api/v1/Subcategory
//  @access Private
const createSubCategory = Factory.createOne(SubCategoryModel);

//  @desc   Create New sub categories
//  @route  Put  api/v1/Subcategory
//  @access Private
const updateSubCategory = Factory.updateOne(SubCategoryModel);

//  @desc   Create New sub categories
//  @route  Post  api/v1/Subcategory
//  @access Private
const deleteSubCategory = Factory.deleteOne(SubCategoryModel);

module.exports = {
  getSubCategorys,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createFilterObj,
  setCategoryIdToBody,
};
