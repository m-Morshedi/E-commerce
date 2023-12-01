const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadSingleImage,
  resizeImage,
} = require("../controllers/brand.controller");

const {
  brandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadSingleImage, resizeImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(brandValidator, getBrand)
  .patch(uploadSingleImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
