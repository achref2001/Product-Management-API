
const Category = require('../../../domain/models/category.model');

// Create a category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      
      // Find and delete the category by ID
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category removed' });
    } catch (error) {
      console.error('Error while deleting category:', error);  // Log the error for debugging
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
