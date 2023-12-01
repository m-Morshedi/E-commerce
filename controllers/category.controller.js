const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
  req.body.image = fileName;
  next();
});

// @decs    Get All Categories
// @route   GET  /api/v1/categories
// @access  public
exports.getCategories = factory.getAll(Category);

// @decs    Get Single Category
// @route   GET   /api/v1/categories/:id
// @access  public
exports.getCategory = factory.getOne(Category);

// @decs    Update Category
// @route   PATCH   /api/v1/categories/:id
// @access  private
exports.updateCategory = factory.updateOne(Category);

// @decs    Delete Category
// @route   DELETE  /api/v1/categories/:id
// @access  private
exports.deleteCategory = factory.deleteOne(Category);

// @decs    Create Category
// @route   POST  /api/v1/categories
// @access  private
exports.createCategory = factory.createOne(Category);
