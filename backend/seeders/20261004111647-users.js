"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash("Password123!", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "John Doe",
        email: "john@example.com",
        password,
        created_at: new Date()
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password,
        created_at: new Date()
      },
      {
        name: "Restaurant Admin",
        email: "admin@example.com",
        password,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: [
        "john@example.com",
        "jane@example.com",
        "admin@example.com"
      ]
    });
  }
};