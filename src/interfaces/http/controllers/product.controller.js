// src/interfaces/http/controllers/product.controller.js
const Product = require('../../../domain/models/product.model');
const Category  = require('../../../domain/models/category.model');

// Get all products (accessible to everyone)
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const getProducts = async (req, res) => {
    try {
      const { categoryId, minPrice, maxPrice } = req.query;
  
      // Build query object
      let query = {};
  
      // Filter by category
      if (categoryId) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          return res.status(404).json({ message: 'Category not found' });
        }
        query.category = categoryId;
      }
  
      // Filter by price range
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice; // Greater than or equal to minPrice
        if (maxPrice) query.price.$lte = maxPrice; // Less than or equal to maxPrice
      }
  
      // Execute query
      const products = await Product.find(query).populate('category', 'name description');
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Get a single product by ID (accessible to everyone)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a product (admin and manager only)
const createProduct = async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
  
    try {
      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Create the product and assign it to the category
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category: category._id,
      });
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Update a product (admin and manager only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product (admin only)
const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;  
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      } else {
        console.log('Product removed successfully:', deletedProduct);
      }
  
      res.status(200).json({ message: 'Product removed' });
    } catch (error) {
      console.error('Error while deleting product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
