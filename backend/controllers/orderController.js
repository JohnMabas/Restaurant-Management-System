

const {
  sequelize,
  User,
  Order,
  OrderItem,
  MenuItem
} = require("../models");

// GET /api/orders
async function getOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "price"]
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "price"]
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order"
    });
  }
}

// POST /api/orders
async function createOrder(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "userId and at least one order item are required"
      });
    }

    const user = await User.findByPk(userId, {
      transaction
    });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        message: "User not found"
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.menuItemId || !item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Each item requires menuItemId and quantity"
        });
      }

      if (Number(item.quantity) <= 0) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Quantity must be greater than 0"
        });
      }

      const menuItem = await MenuItem.findByPk(
        item.menuItemId,
        {
          transaction
        }
      );

      if (!menuItem) {
        await transaction.rollback();

        return res.status(404).json({
          message: `Menu item ${item.menuItemId} not found`
        });
      }

      if (!menuItem.available) {
        await transaction.rollback();

        return res.status(400).json({
          message: `${menuItem.name} is currently unavailable`
        });
      }

      const quantity = Number(item.quantity);
      const unitPrice = Number(menuItem.price);

      totalAmount += quantity * unitPrice;

      orderItems.push({
        menuItemId: menuItem.id,
        quantity,
        unitPrice
      });
    }

    const order = await Order.create(
      {
        userId,
        status: "pending",
        totalAmount: totalAmount.toFixed(2)
      },
      {
        transaction
      }
    );

    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        },
        {
          transaction
        }
      );
    }

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "price"]
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to create order"
    });
  }
}

// PUT /api/orders/:id
async function updateOrder(req, res) {
  try {
    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    await order.update({
      status
    });

    res.status(200).json({
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update order"
    });
  }
}

// DELETE /api/orders/:id
async function deleteOrder(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    await order.destroy();

    res.status(200).json({
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete order"
    });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};