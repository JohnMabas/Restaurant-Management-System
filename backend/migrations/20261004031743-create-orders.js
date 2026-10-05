"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "users",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      status: {
        type: Sequelize.ENUM(
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

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  }
};