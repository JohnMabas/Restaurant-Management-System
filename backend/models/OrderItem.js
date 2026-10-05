
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "order_id"
    },

    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "menu_item_id"
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "unit_price"
    }
  },
  {
    tableName: "order_items",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = OrderItem;