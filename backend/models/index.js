
const User = require("./user");
const Category = require("./Category");
const MenuItem = require("./MenuItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const sequelize = require("../config/database");


// USER → ORDER

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders"
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});


// CATEGORY → MENU ITEM

Category.hasMany(MenuItem, {
  foreignKey: "categoryId",
  as: "menuItems"
});

MenuItem.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category"
});

// ORDER → ORDER ITEM

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items"
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order"
});

// MENU ITEM → ORDER ITEM

MenuItem.hasMany(OrderItem, {
  foreignKey: "menuItemId",
  as: "orderItems"
});

OrderItem.belongsTo(MenuItem, {
  foreignKey: "menuItemId",
  as: "menuItem"
});

module.exports = {
  sequelize,
  User,
  Category,
  MenuItem,
  Order,
  OrderItem
};