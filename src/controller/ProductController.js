const ProductModel = require("../models/ProductModel");
const Factory = require("./handlersFactory");

// @desc    get All Product
// @route   grt api/v1/product
// @access  public
const getProducts = Factory.getAll(ProductModel);

// @desc    get one Product
// @route   grt api/v1/product/:id
// @access  public
const getProduct = Factory.getOne(ProductModel);

// @desc    Create New Product
// @route   Post api/v1/product
// @access  private
const createNewProduct = Factory.createOne(ProductModel);

// @desc    update  Product
// @route   update api/v1/product
// @access  private
const updateProduct = Factory.updateOne(ProductModel);

// @desc    delete  Product
// @route   delete api/v1/product/:id
// @access  private
const deleteProduct = Factory.deleteOne(ProductModel);

module.exports = {
  getProducts,
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
