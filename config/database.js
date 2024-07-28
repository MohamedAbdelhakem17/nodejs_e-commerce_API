const mongoose = require('mongoose');
const { connectionString } = require("./variable")
const dbConnection = () => {
    mongoose
        .connect(connectionString)
        .then(conn => {
            console.log(`Database Connected : ${conn.connection.host}`)
        })
        .catch(err => {
            console.log(`Database Error : ${err}`)
            process.exit(1)
        })
}

module.exports = dbConnection