
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  isDeleted: {  // Soft deletion flag
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
