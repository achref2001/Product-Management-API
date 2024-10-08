// src/interfaces/http/routes/product.routes.js
const express = require('express');
const { protect } = require('../../../infrastructure/middlewares/auth.middleware');
const checkRole = require('../../../infrastructure/middlewares/role.middleware');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require('../controllers/product.controller');

const router = express.Router();

// Public route: Clients (and everyone) can view products
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin and Manager can create products
 
router.post('/', protect, checkRole('admin', 'manager'), createProduct);

// Admin and Manager can update products
router.put('/:id', protect, checkRole('admin', 'manager'), updateProduct);

// Only Admin can delete products
router.delete('/:id', protect, checkRole('admin'), deleteProduct);

module.exports = router;
