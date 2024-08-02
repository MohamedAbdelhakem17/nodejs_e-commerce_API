const errorFormat = (array) => {
    const error = array.reduce((acc, error) => {
        acc[error.path] = (acc[error.path] || []).concat(error.msg)
        return acc
    }, {})
    return error
}

module.exports = errorFormat
