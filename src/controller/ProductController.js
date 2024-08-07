/* eslint-disable node/no-unsupported-features/es-syntax */
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const httpStatus = require("../config/httpStatus");
const AppErorr = require("../utils/customError");
const ProductModel = require("../models/ProductModel");

// @desc    get All Product
// @route   grt api/v1/product
// @access  public
const getProducts = asyncHandler(async (req, res) => {
    // 1- Filtration
    const options = ["limit", "page", "sort", "filed", "keyword"];
    let filterQuery = { ...req.query };
    options.forEach((option) => delete filterQuery[option]);
    filterQuery = JSON.stringify(filterQuery).replace(/\b(gt|gte|eq|ne|lt|lte)\b/gi, (match) => `$${match}`);
    filterQuery = JSON.parse(filterQuery);

    // 2- Pagination
    const limit = parseInt(req.query.limit, 10) || 50;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;
    let mongooseQuery = ProductModel.find(filterQuery).skip(skip).limit(limit);

    // 3- Sorting
    const sortMode = req.query.sort;
    if (sortMode) {
        const sortOptions = sortMode.split(",").join(" ");
        mongooseQuery = mongooseQuery.sort(sortOptions);
    } else {
        mongooseQuery = mongooseQuery.sort("createdAt");
    }

    // 4- Field Selection
    const fieldMode = req.query.filed;
    if (fieldMode) {
        const fieldOptions = fieldMode.split(",").join(" ");
        mongooseQuery = mongooseQuery.select(fieldOptions);
    } else {
        mongooseQuery = mongooseQuery.select("-__v");
    }

    // 5- keyword Search
    const { keyword } = req.query;
    if (keyword) {
        const query = {};
        query.$or = [
            { title: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
        ]; 
        mongooseQuery = mongooseQuery.find(query);
    }

    const data = await mongooseQuery;
    res.status(200).json({ status: httpStatus.SUCCESS, data });
});

// @desc    get one Product
// @route   grt api/v1/product/:id
// @access  public
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ProductModel.findById(id, { __v: 0 });
    if (!data)
        throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`);
    res.status(200).json({ status: httpStatus.SUCCESS, data });
});

// @desc    Create New Product
// @route   Post api/v1/product
// @access  private
const createNewProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json({ status: httpStatus.SUCCESS, data: newProduct });
});
// @desc    update  Product
// @route   update api/v1/product
// @access  private
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ProductModel.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
    });
    if (!data)
        throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`);
    res.status(201).json({ status: httpStatus.SUCCESS, data });
});

// @desc    delete  Product
// @route   delete api/v1/product/:id
// @access  private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await ProductModel.findByIdAndDelete({ _id: id });
    if (!data)
        throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`);
    res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
    getProducts,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct,
};
