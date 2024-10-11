const Category = require("../../../domain/models/category.model");

// Create a category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    // Only return categories that are not marked as deleted
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get category by ID 
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Soft delete a category (mark as deleted)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Mark the category as deleted (soft delete)
    category.isDeleted = true;
    await category.save();

    res.status(200).json({ message: "Category soft deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Restore a soft-deleted category (optional)
const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: true,
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or not deleted" });
    }

    // Restore the category by setting isDeleted to false
    category.isDeleted = false;
    await category.save();

    res.status(200).json({ message: "Category restored", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory, // Soft delete
  restoreCategory, // Restore soft-deleted category (optional)
};
