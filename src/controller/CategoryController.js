const slugify = require('slugify')
const asyncHandler = require('express-async-handler')

const CategoryModel = require("../models/CategoryModel")
const AppErorr = require("../utils/customError")
const httpStatus = require("../config/httpStatus")


// @desc   Get List Of category
// @route  GET  api/v1/category 
// @access Public
const getCategorys = asyncHandler(
    async (req, res) => {
        // pagination
        const page = +req.query.page || 1
        const limit = +req.query.limit || 5
        const skip = (page - 1) * limit
        const data = await CategoryModel.find({}, { __v: 0 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Get Spesific category
//  @route  GET / api/v1/category/:id
// @access  Public
const getCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await CategoryModel.findById(id, { __v: 0 })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New category
//  @route  Post  api/v1/category 
//  @access Private 
const createCategory = asyncHandler(
    async (req, res) => {
        const { name } = req.body
        const categoryCreated = await CategoryModel.create({ name, slug: slugify(name), image: "" })
        const result = categoryCreated.toObject()
        delete result.__v;
        res.status(201).json({ status: httpStatus.SUCCESS, data: result })
    }
)

//  @desc   Update category 
//  @route  Put  api/v1/category/:id
//  @access Private 
const updateCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        const data = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This ${id}`)
        delete data.__v
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Delete category 
//  @route  Delete  api/v1/category/:id
//  @access Private 
const deleteCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await CategoryModel.findByIdAndDelete({ _id: id })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `No Category For This ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data: null })
    }
)

module.exports = {
    getCategorys,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
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
