const express = require('express');
const { protect } = require('../../../infrastructure/middlewares/auth.middleware');
const checkRole = require('../../../infrastructure/middlewares/role.middleware');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const router = express.Router();

// Create a category (Admin/Manager)
router.post('/', protect, checkRole('admin', 'manager'), createCategory);

// Get all categories
router.get('/', getCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Update category (Admin/Manager)
router.put('/:id',protect, checkRole('admin', 'manager'), updateCategory);

// Delete category (Admin)
router.delete('/:id',protect, checkRole('admin', 'manager'), deleteCategory);

module.exports = router;
