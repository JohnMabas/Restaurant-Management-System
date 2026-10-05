"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("categories", [
      {
        name: "Burgers",
        created_at: new Date()
      },
      {
        name: "Pizza",
        created_at: new Date()
      },
      {
        name: "Drinks",
        created_at: new Date()
      },
      {
        name: "Sides",
        created_at: new Date()
      },
      {
        name: "Desserts",
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", {
      name: [
        "Burgers",
        "Pizza",
        "Drinks",
        "Sides",
        "Desserts"
      ]
    });
  }
};