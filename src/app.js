const path = require("path");

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const dbConnection = require("./config/database");
const globalErrorHandelr = require("./middleware/globalErrorMiddleware");
const AppError = require("./utils/customError");
const httpStatus = require("./config/httpStatus");
const { environment, serverPort } = require("./config/variable");

// Routes Select
const CategoryRoute = require("./routes/CategoryRoute");
const SubcategoryRoute = require("./routes/SubCategoryRoute");
const BrandRoute = require("./routes/BrandRoute");
const ProductRoute = require("./routes/ProductRoute");

// Database Connection
dbConnection();

// Express App
const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")))


if (environment === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${environment}`);
}

// Routes
app.use("/api/v1/category", CategoryRoute);
app.use("/api/v1/subcategory", SubcategoryRoute);
app.use("/api/v1/brand", BrandRoute);
app.use("/api/v1/product", ProductRoute);

// Handel not found Route
app.use("*", (req) => {
  throw new AppError(
    404,
    httpStatus.FAIL,
    `Not Found Route ${req.originalUrl}`
  );
});

// Global Error Handler
app.use(globalErrorHandelr);

const server = app.listen(serverPort || 8090, () => {
  console.log(`Sever Running in Port : ${serverPort || 8090}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Errors : ${error.name}| ${error.message}`);
  server.close(() => {
    console.log("Server Closed");
    process.exit(1);
  });
});
