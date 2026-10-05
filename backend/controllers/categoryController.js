
const { Category } = require("../models");

// GET /api/categories
async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]]
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch categories"
    });
  }
}

// GET /api/categories/:id
async function getCategoryById(req, res) {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch category"
    });
  }
}

// POST /api/categories
async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory = await Category.findOne({
      where: { name }
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create category"
    });
  }
}

// PUT /api/categories/:id
async function updateCategory(req, res) {
  try {
    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    await category.update({
      name
    });

    res.status(200).json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update category"
    });
  }
}

// DELETE /api/categories/:id
async function deleteCategory(req, res) {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.destroy();

    res.status(200).json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete category"
    });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};