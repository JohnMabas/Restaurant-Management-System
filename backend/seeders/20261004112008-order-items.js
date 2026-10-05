"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("order_items", [
      // Order 1
      {
        order_id: 1,
        menu_item_id: 1,
        quantity: 1,
        unit_price: 3500.00,
        created_at: new Date()
      },
      {
        order_id: 1,
        menu_item_id: 7,
        quantity: 1,
        unit_price: 1800.00,
        created_at: new Date()
      },
      {
        order_id: 1,
        menu_item_id: 5,
        quantity: 1,
        unit_price: 1000.00,
        created_at: new Date()
      },
      {
        order_id: 1,
        menu_item_id: 6,
        quantity: 1,
        unit_price: 1500.00,
        created_at: new Date()
      },

      // Order 2
      {
        order_id: 2,
        menu_item_id: 3,
        quantity: 1,
        unit_price: 6500.00,
        created_at: new Date()
      },
      {
        order_id: 2,
        menu_item_id: 5,
        quantity: 1,
        unit_price: 1000.00,
        created_at: new Date()
      },
      {
        order_id: 2,
        menu_item_id: 7,
        quantity: 1,
        unit_price: 1800.00,
        created_at: new Date()
      },

      // Order 3
      {
        order_id: 3,
        menu_item_id: 2,
        quantity: 1,
        unit_price: 3200.00,
        created_at: new Date()
      },
      {
        order_id: 3,
        menu_item_id: 9,
        quantity: 1,
        unit_price: 2500.00,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("order_items", {
      order_id: [1, 2, 3]
    });
  }
};