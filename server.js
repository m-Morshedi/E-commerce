const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config({ path: "config.env" });
const ApiError = require("./utils/apiError");

const dbConnection = require("./config/database");

dbConnection();

const categoryRoute = require("./routes/category.route");
const subCategoryRoute = require("./routes/subCategory.route");
const brandRoute = require("./routes/brand.route");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const globalError = require("./middleware/errorMiddleware");

// express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new ApiError("Can't find this route", 400));
});

// Global error handling middleware for express
app.use(globalError);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});

// Handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Application Shutdown...");
    process.exit(1);
  });
});
