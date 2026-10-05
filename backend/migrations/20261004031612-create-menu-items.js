"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menu_items", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "categories",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("menu_items");
  }
};