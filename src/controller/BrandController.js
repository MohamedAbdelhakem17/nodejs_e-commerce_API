const slugify = require('slugify')
const asyncHandler = require('express-async-handler')

const BrandModel = require("../models/BrandModel")
const AppErorr = require("../utils/customError")
const httpStatus = require("../config/httpStatus")


// @desc   Get List Of Brand
// @route  GET  api/v1/brand 
// @access Public
const getBrands = asyncHandler(
    async (req, res) => {
        // pagination
        const page = +req.query.page || 1
        const limit = +req.query.limit || 5
        const skip = (page - 1) * limit
        const data = await BrandModel.find({}, { __v: 0 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Get Spesific Brand
//  @route  GET / api/v1/brand/:id
// @access  Public
const getBrand = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await BrandModel.findById(id, { __v: 0 })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Brand For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New Brand
//  @route  Post  api/v1/brand 
//  @access Private 
const createBrand = asyncHandler(
    async (req, res) => {
        const { name } = req.body
        const brandCreate = await BrandModel.create({ name, slug: slugify(name), image: "" })
        const result = brandCreate.toObject()
        delete result.__v;
        res.status(201).json({ status: httpStatus.SUCCESS, data: result })
    }
)

//  @desc   Update Brand 
//  @route  Put  api/v1/Brand/:id
//  @access Private 
const updateBrand = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        const data = await BrandModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Brand For This id ${id}`)
        delete data.__v
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Delete Brand 
//  @route  Delete  api/v1/brand/:id
//  @access Private 
const deleteBrand = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await BrandModel.findByIdAndDelete({ _id: id })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data: null })
    }
)

module.exports = {
    getBrands,
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}












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
