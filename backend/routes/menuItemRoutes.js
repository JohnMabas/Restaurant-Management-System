
const express = require("express");

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuItemController");

const router = express.Router();

// GET /api/menu-items
router.get("/", getMenuItems);

// GET /api/menu-items/:id
router.get("/:id", getMenuItemById);

// POST /api/menu-items
router.post("/", createMenuItem);

// PUT /api/menu-items/:id
router.put("/:id", updateMenuItem);

// DELETE /api/menu-items/:id
router.delete("/:id", deleteMenuItem);

module.exports = router;