
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MenuItem = sequelize.define(
  "MenuItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id"
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "menu_items",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = MenuItem;