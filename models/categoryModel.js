const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, 'Duplicate Name'],
      minlength: [3, 'Too Short Category Name'],
      maxlength: [30, 'Too Long Category Name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

categorySchema.post('save', (doc) => {
  setImageURL(doc);
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
