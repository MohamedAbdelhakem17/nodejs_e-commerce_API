class AppError extends Error {
    constructor(statusCode, statusText, message) {
        super(message)
        this.statusCode = statusCode
        this.statusText = statusText
        this.message = message
    }
}

module.exports = AppError