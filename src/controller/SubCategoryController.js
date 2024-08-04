const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const SubCategoryModel = require("../models/SubCategoryModel")
const httpStatus = require("../config/httpStatus")
const AppErorr = require("../utils/customError")



// Nested route
// GET /api/v1/categories/:categoryId/subcategories
const createFilterObj = (req, res, next) => {
    const filterObject = req.params.categoryId
        ? { category: req.params.categoryId }
        : {}

    req.filterObj = filterObject;
    console.log("Filter", req.filterObj)
    next();
};

//  @desc   Create New sub categories
//  @route  Get  api/v1/subcategories/:id
//  @access public     
const getSubCategorys = asyncHandler(
    async (req, res) => {
        // pagination
        const page = +req.query.page || 1
        const limit = +req.query.limit || 5
        const skip = (page - 1) * limit
        const data = await SubCategoryModel.find(req.filterObj, { __v: 0 })
            .skip(skip)
            .limit(limit)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New sub categories
//  @route  Get  api/v1/Subcategory/:id 
//  @access public 
const getSubCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await SubCategoryModel.findById(id, { __v: 0 })
        console.log(data, id)
        console.log("NNO")
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sub Catrgory For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)


// Post /api/v1/categories/:categoryId/subcategories
const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId
    next();
};

//  @desc   Create New sub categories
//  @route  Post  api/v1/Subcategory 
//  @access Private 
const createSubCategory = asyncHandler(
    async (req, res) => {
        const { name, category } = req.body
        const newSubCategory = await SubCategoryModel.create({ name, slug: slugify(name), image: "", category })
        const result = newSubCategory.toObject()
        delete result.__v
        res.status(201).json({ status: httpStatus.SUCCESS, data: result })
    }
)

//  @desc   Create New sub categories
//  @route  Put  api/v1/Subcategory 
//  @access Private 
const updateSubCategory = asyncHandler(
    async (req, res) => {
        const { name } = req.body
        const { id } = req.params
        const data = await SubCategoryModel.findOneAndUpdate({ _id: id }, { name: name, slug: slugify(name) }, { new: true })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sub Catrgory For This id ${id}`)
        delete data.__v
        res.status(201).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New sub categories
//  @route  Post  api/v1/Subcategory 
//  @access Private 
const deleteSubCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await SubCategoryModel.findOneAndDelete({ _id: id })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sub Catrgory For This id ${id}`)
        res.status(201).json({ status: httpStatus.SUCCESS, data: null })
    }
)

module.exports = {
    getSubCategorys,
    getSubCategory,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    createFilterObj,
    setCategoryIdToBody
}