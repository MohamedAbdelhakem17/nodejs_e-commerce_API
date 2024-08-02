const mongoose = require('mongoose');
const { connectionString } = require("./variable")
const dbConnection = () => {
    mongoose
        .connect(connectionString)
        .then(conn => {
            console.log(`Database Connected : ${conn.connection.host}`)
        })
}

module.exports = dbConnection