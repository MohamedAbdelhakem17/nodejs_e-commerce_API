const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const httpStatus = require("../config/httpStatus")
const AppErorr = require("../utils/customError")
const ProductModel = require("../models/ProductModel")

// @desc    get All Product
// @route   grt api/v1/product
// @access  public
const getProducts = asyncHandler(
    async (req, res) => {
        const limit = req.query.limit || 2
        const page = req.query.page || 1
        const skip = (page - 1) * limit
        const data = await ProductModel.find({}, { __v: 0 }).skip(skip).limit(limit)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

// @desc    get one Product
// @route   grt api/v1/product/:id
// @access  public
const getProduct = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await ProductModel.findById(id, { __v: 0 })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

// @desc    Create New Product
// @route   Post api/v1/product
// @access  private
const createNewProduct = asyncHandler(
    async (req, res) => {
        req.body.slug = slugify(req.body.title)
        const newProduct = await ProductModel.create(req.body)
        res.status(201).json({ status: httpStatus.SUCCESS, data: newProduct })
    }
)
// @desc    update  Product
// @route   update api/v1/product
// @access  private
const updateProduct = asyncHandler(
    async (req, res) => {
        if (req.body.title) req.body.slug = slugify(req.body.title)
        const { id } = req.params
        const data = await ProductModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`)
        res.status(201).json({ status: httpStatus.SUCCESS, data })
    }
)

// @desc    delete  Product
// @route   delete api/v1/product/:id
// @access  private
const deleteProduct = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await ProductModel.findByIdAndDelete({ _id: id })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data: null })
    }
)

module.exports = {
    getProducts,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct
}




