require('dotenv').config()

const express = require("express")
const morgan = require('morgan')
const dbConnection = require("./config/database.js")
const globalErrorHandelr = require("./middleware/globalError.js")
const AppError = require('./utils/customError.js')
const httpStatus = require("./config/httpStatus")


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

// Handel not found Route 
app.use("*", (req, res, next) => {
    throw new AppError(404, httpStatus.FAIL, `Not Found Route ${req.originalUrl}`)
})

// Global Error Handler 
app.use(globalErrorHandelr)


const server = app.listen(serverPort || 8090, () => {
    console.log(`Sever Running in Port : ${serverPort || 8090}`)
})

// Handle rejection outside express
process.on('unhandledRejection', (error) => {
    console.log(`unhandledRejection Errors : ${error.name}| ${error.message}`)
    server.close(() => {
        console.log("Server Closed")
        process.exit(1)
    })
})