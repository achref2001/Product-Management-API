const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be greater than or equal to 0'],
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock must be greater than or equal to 0'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,  // Product must have a category
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {  // Soft deletion flag
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
