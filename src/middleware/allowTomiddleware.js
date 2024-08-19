const AppError = require("../utils/customError");
const httpStatus = require("../config/httpStatus");

const allowTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        httpStatus.FAIL,
        "You are not allowed to access this route."
      );
    }
    next();
  };

module.exports = allowTo;
