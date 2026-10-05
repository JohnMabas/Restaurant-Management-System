
const {
  OrderItem,
  Order,
  MenuItem
} = require("../models");

// GET /api/order-items
async function getOrderItems(req, res) {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: MenuItem,
          as: "menuItem",
          attributes: ["id", "name", "price"]
        },
        {
          model: Order,
          as: "order",
          attributes: ["id", "userId", "status"]
        }
      ],
      order: [["id", "ASC"]]
    });

    res.status(200).json(orderItems);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order items"
    });
  }
}

// GET /api/order-items/:id
async function getOrderItemById(req, res) {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [
        {
          model: MenuItem,
          as: "menuItem",
          attributes: ["id", "name", "price"]
        },
        {
          model: Order,
          as: "order",
          attributes: ["id", "userId", "status"]
        }
      ]
    });

    if (!orderItem) {
      return res.status(404).json({
        message: "Order item not found"
      });
    }

    res.status(200).json(orderItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order item"
    });
  }
}

// PUT /api/order-items/:id
async function updateOrderItem(req, res) {
  try {
    const { quantity } = req.body;

    const orderItem = await OrderItem.findByPk(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        message: "Order item not found"
      });
    }

    if (quantity === undefined || Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    await orderItem.update({
      quantity
    });

    res.status(200).json({
      message: "Order item updated successfully",
      orderItem
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update order item"
    });
  }
}

// DELETE /api/order-items/:id
async function deleteOrderItem(req, res) {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        message: "Order item not found"
      });
    }

    await orderItem.destroy();

    res.status(200).json({
      message: "Order item deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete order item"
    });
  }
}

module.exports = {
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
};