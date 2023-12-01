const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {
  uploadMultipleOfImages,
} = require("../middleware/uploadImageMiddleware");
const Product = require("../models/productModel");
const factory = require("./handlerFactory");

exports.uploadMultipleImages = uploadMultipleOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// image processing
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, index) => {
        const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${fileName}`);
        req.body.images.push(fileName);
      })
    );
  }
  next();
});

// @decs    Get All Product
// @route   GET  /api/v1/products
// @access  public
exports.getProducts = factory.getAll(Product, "Product");

// @decs    Get Single Product
// @route   GET   /api/v1/products/:id
// @access  public
exports.getProduct = factory.getOne(Product);

// @decs    Update Product
// @route   PATCH   /api/v1/products/:id
// @access  private
exports.updateProduct = factory.updateOne(Product);

// @decs    Delete Product
// @route   DELETE  /api/v1/products/:id
// @access  private
exports.deleteProduct = factory.deleteOne(Product);

// @decs    Create Product
// @route   POST  /api/v1/products
// @access  private
exports.createProduct = factory.createOne(Product);
