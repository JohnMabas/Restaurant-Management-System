
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id"
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending"
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "total_amount"
    }
  },
  {
    tableName: "orders",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Order;