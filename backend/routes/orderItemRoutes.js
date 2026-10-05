
const express = require("express");

const {
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
} = require("../controllers/orderItemController");

const router = express.Router();

// GET /api/order-items
router.get("/", getOrderItems);

// GET /api/order-items/:id
router.get("/:id", getOrderItemById);

// PUT /api/order-items/:id
router.put("/:id", updateOrderItem);

// DELETE /api/order-items/:id
router.delete("/:id", deleteOrderItem);

module.exports = router;