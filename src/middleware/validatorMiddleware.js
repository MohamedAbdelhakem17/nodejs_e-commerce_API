const { validationResult } = require("express-validator")

const AppError = require("../utils/customError")
const httpStatus = require("../config/httpStatus")
const errorFormat = require("../utils/errorFormat")

const validatorMiddleware = (req, res , next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new AppError(400, httpStatus.FAIL, errorFormat(errors.array()))
    }
    next()
}

module.exports = validatorMiddleware

