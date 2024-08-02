const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const SupCategoryModel = require("../models/SupCategoryModel")
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

//  @desc   Create New Sup category
//  @route  Get  api/v1/supcategory/:id
//  @access public     
const getSupCategorys = asyncHandler(
    async (req, res) => {
        // pagination
        const page = +req.query.page || 1
        const limit = +req.query.limit || 5
        const skip = (page - 1) * limit
        const data = await SupCategoryModel.find(req.filterObj, { __v: 0 })
            .skip(skip)
            .limit(limit)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New Sup category
//  @route  Get  api/v1/supcategory/:id 
//  @access public 
const getSupCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await SupCategoryModel.findById(id, { __v: 0 })
        console.log(data, id)
        console.log("NNO")
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sup Catrgory For This id ${id}`)
        res.status(200).json({ status: httpStatus.SUCCESS, data })
    }
)


// Post /api/v1/categories/:categoryId/subcategories
const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId
    next();
};

//  @desc   Create New Sup category
//  @route  Post  api/v1/supcategory 
//  @access Private 
const createSupCategory = asyncHandler(
    async (req, res) => {
        const { name, category } = req.body
        const newSupCategory = await SupCategoryModel.create({ name, slug: slugify(name), image: "", category })
        const result = newSupCategory.toObject()
        delete result.__v
        res.status(201).json({ status: httpStatus.SUCCESS, data: result })
    }
)

//  @desc   Create New Sup category
//  @route  Put  api/v1/supcategory 
//  @access Private 
const updateSupCategory = asyncHandler(
    async (req, res) => {
        const { name } = req.body
        const { id } = req.params
        const data = await SupCategoryModel.findOneAndUpdate({ _id: id }, { name: name, slug: slugify(name) }, { new: true })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sup Catrgory For This id ${id}`)
        delete data.__v
        res.status(201).json({ status: httpStatus.SUCCESS, data })
    }
)

//  @desc   Create New Sup category
//  @route  Post  api/v1/supcategory 
//  @access Private 
const deleteSupCategory = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        const data = await SupCategoryModel.findOneAndDelete({ _id: id })
        if (!data) throw new AppErorr(404, httpStatus.FAIL, `Not Found Sup Catrgory For This id ${id}`)
        res.status(201).json({ status: httpStatus.SUCCESS, data: null })
    }
)

module.exports = {
    getSupCategorys,
    getSupCategory,
    createSupCategory,
    updateSupCategory,
    deleteSupCategory,
    createFilterObj,
    setCategoryIdToBody
}