"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("orders", [
      {
        user_id: 1,
        status: "completed",
        total_amount: 7800.00,
        created_at: new Date()
      },
      {
        user_id: 2,
        status: "preparing",
        total_amount: 9300.00,
        created_at: new Date()
      },
      {
        user_id: 1,
        status: "pending",
        total_amount: 5700.00,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("orders", {
      user_id: [1, 2]
    });
  }
};
