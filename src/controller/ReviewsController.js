const Factory = require("./handlersFactory");
const ReviewModel = require("../models/ReviewModel");

// Nested route
// GET /api/v1/product/:productId/reviews
const createFilterObject = (req, res, next) => {
  const filterObject = req.params.productId
    ? { product: req.params.productId }
    : {};

  req.body.filterObj = filterObject;
  next();
};

// @desc    get All Reviews
// @route   get api/v1/reviews
// @access  Public
const getAllReviews = Factory.getAll(ReviewModel);

// @desc    get All Review
// @route   get api/v1/review
// @access  Public
const getReview = Factory.getOne(ReviewModel);

// Nested route
// GET /api/v1/product/:productId/reviews
const setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

// @desc    Create New Review
// @route   Post api/v1/review
// @access  protect/user
const createReview = Factory.createOne(ReviewModel);

// @desc    update Review
// @route   put api/v1/review/:id
// @access  protect/user
const updateReview = Factory.updateOne(ReviewModel);

// @desc    delete Review
// @route   Post api/v1/review/:id
// @access  protect/user
const deleteReview = Factory.deleteOne(ReviewModel);

module.exports = {
  getAllReviews,
  createFilterObject,
  getReview,
  createReview,
  setProductIdToBody,
  updateReview,
  deleteReview,
};
