const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const httpStatus = require("../config/httpStatus");
const AppErorr = require("../utils/customError");
const ApiFeatures = require("../utils/apiFeatures");

const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filterObject = {};
    if (req.body.filterObj) {
      filterObject = req.body.filterObj;
    }
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObject), req.query)
      .pagination(documentsCounts)
      .filter()
      .sort()
      .fields()
      .search(Model.modelName);
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    console.log(Model.modelName);
    res
      .status(200)
      .json({ status: httpStatus.SUCCESS, paginationResult, data: documents });
  });

const getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document)
      throw new AppErorr(404, httpStatus.FAIL, `No Document For This id ${id}`);
    res.status(200).json({ status: httpStatus.SUCCESS, data: document });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    console.log(Model);
    if (Model.modelName === "Product") {
      req.body.slug = slugify(req.body.title);
    } else {
      req.body.slug = slugify(req.body.name);
    }

    const newProduct = await Model.create(req.body);
    res.status(201).json({ status: httpStatus.SUCCESS, data: newProduct });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document)
      throw new AppErorr(404, httpStatus.FAIL, `No Document For This id ${id}`);
    res.status(201).json({ status: httpStatus.SUCCESS, data: document });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete({ _id: id });
    if (!document)
      throw new AppErorr(404, httpStatus.FAIL, `No Document For This id ${id}`);
    res.status(200).json({ status: httpStatus.SUCCESS, data: null });
  });

module.exports = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
