const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.statusText = error.statusText || "error"
    // res.status(error.statusCode).json({ status: error.statusText, data: error.message });
    res.status(error.statusCode).json({ status: error.statusText, data: error.message , stack:error.stack});
};

module.exports = globalErrorHandler;
