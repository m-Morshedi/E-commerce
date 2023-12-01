const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.ProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Category Required")
    .isLength({ min: 3 })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("Product price must be number")
    .isLength({ max: 32 })
    .withMessage("Too long Price"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be array of strings"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of strings"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),

  check("category")
    .notEmpty()
    .withMessage("product must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category ID Format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category For This id : ${categoryId}`)
          );
        }
      })
    ),

  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid SubCategory ID Format")
    .custom((subcategoryId) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoryId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoryId.length) {
            return Promise.reject(
              new Error(`No SubCategory For This id : ${subcategoryId}`)
            );
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then((subcategory) => {
        const subcategoryInDB = [];
        subcategory.forEach((item) => {
          subcategoryInDB.push(item._id.toString());
        });
        if (!val.every((v) => subcategoryInDB.includes(v))) {
          return Promise.reject(
            new Error(
              `SubCategory ${val} does not belong to category ${req.body.category}`
            )
          );
        }
      })
    ),

  check("brand").optional().isMongoId().withMessage("Invalid Brand ID Format"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratings must be Number")
    .isLength({ min: 1 })
    .withMessage("ratings must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("ratings must be below or equal to 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratings must be Number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];
