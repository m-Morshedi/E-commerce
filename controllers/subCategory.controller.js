const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlerFactory');

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @decs    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  private
exports.createSubCategory = factory.createOne(SubCategory);

// nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// @decs    Get All SubCategories
// @route   GET  /api/v1/subcategories
// @access  public
exports.getSubCategories = factory.getAll(SubCategory);

// @decs    Get Single SubCategory by id
// @route   GET   /api/v1/subcategories/:id
// @access  public
exports.getSubCategory = factory.getOne(SubCategory);

// @decs    Update SubCategory
// @route   PATCH   /api/v1/subcategories/:id
// @access  private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @decs    Delete SubCategory
// @route   DELETE  /api/v1/categories/:id
// @access  private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
