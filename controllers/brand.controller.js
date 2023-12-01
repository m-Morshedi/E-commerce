const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const factory = require("./handlerFactory");

exports.uploadSingleImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});

// @decs    Get All Brands
// @route   GET  /api/v1/brands
// @access  public
exports.getBrands = factory.getAll(Brand);

// @decs    Get Single brand
// @route   GET   /api/v1/brands/:id
// @access  public
exports.getBrand = factory.getOne(Brand);

// @decs    Update brand
// @route   PATCH   /api/v1/brands/:id
// @access  private
exports.updateBrand = factory.updateOne(Brand);

// @decs    Delete brand
// @route   DELETE  /api/v1/brands/:id
// @access  private
exports.deleteBrand = factory.deleteOne(Brand);

// @decs    Create Brand
// @route   POST  /api/v1/brands
// @access  private
exports.createBrand = factory.createOne(Brand);
