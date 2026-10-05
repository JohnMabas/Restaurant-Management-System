
const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const router = express.Router();

// GET /api/categories
router.get("/", getCategories);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

// POST /api/categories
router.post("/", createCategory);

// PUT /api/categories/:id
router.put("/:id", updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

module.exports = router;