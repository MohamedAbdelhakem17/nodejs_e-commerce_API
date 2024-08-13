const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.statusText = error.statusText || "error";
  if (error.name === "JsonWebTokenError") {
    error.message = "Invalid token, please login again..";
    error.statusCode = 401;
  }

  if (error.name === "TokenExpiredError") {
    error.message = "Expired token, please login again..";
    error.statusCode = 401;
  }

  res
    .status(error.statusCode)
    .json({ status: error.statusText, data: error.message });
    
  //   res.status(error.statusCode).json({
  //     status: error.statusText,
  //     data: error.message,
  //     stack: error.stack,
  //   });
};

module.exports = globalErrorHandler;
