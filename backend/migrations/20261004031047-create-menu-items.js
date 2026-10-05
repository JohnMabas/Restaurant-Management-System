"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "orders",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      menu_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "menu_items",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  }
};
