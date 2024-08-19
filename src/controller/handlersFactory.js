const asyncHandler = require("express-async-handler");

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

    res
      .status(200)
      .json({ status: httpStatus.SUCCESS, paginationResult, data: documents });
  });

const getOne = (Model, populate) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populate) query = query.populate(populate);
    const document = await query;
    if (!document)
      throw new AppErorr(404, httpStatus.FAIL, `No Document For This id ${id}`);
    res.status(200).json({ status: httpStatus.SUCCESS, data: document });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ status: httpStatus.SUCCESS, data: document });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document)
      throw new AppErorr(404, httpStatus.FAIL, `No Document For This id ${id}`);
    document.save();
    res.status(201).json({ status: httpStatus.SUCCESS, data: document });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

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
