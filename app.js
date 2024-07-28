require('dotenv').config()

const express = require("express")
const morgan = require('morgan')
const dbConnection = require("./config/database.js")

const { environment, serverPort } = require("./config/variable.js")
const CategoryRoute = require("./routes/CategoryRoute.js")

// Database Connection
dbConnection()

// Express App
const app = express()

// middleware
app.use(express.json())

if (environment === "development") {
    app.use(morgan("dev"))
    console.log(`Mode : ${environment}`)
}


// Routes
app.use("/api/v1/category", CategoryRoute)


app.listen(serverPort || 8090, () => {
    console.log(`Sever Running in Port : ${serverPort || 8090}`)
})