"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("menu_items", [
      {
        category_id: 1,
        name: "Classic Beef Burger",
        description: "Beef patty with lettuce, tomato, onion and special sauce.",
        price: 3500.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 1,
        name: "Chicken Burger",
        description: "Crispy chicken fillet with lettuce and mayonnaise.",
        price: 3200.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 2,
        name: "Chicken Pizza",
        description: "Pizza topped with chicken, cheese and vegetables.",
        price: 6500.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 2,
        name: "Beef Pepperoni Pizza",
        description: "Cheesy pizza with beef pepperoni.",
        price: 7000.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 3,
        name: "Coca-Cola",
        description: "Chilled soft drink.",
        price: 1000.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 3,
        name: "Orange Juice",
        description: "Fresh orange juice.",
        price: 1500.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 4,
        name: "French Fries",
        description: "Crispy seasoned French fries.",
        price: 1800.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 4,
        name: "Chicken Wings",
        description: "Spicy grilled chicken wings.",
        price: 3000.00,
        available: true,
        created_at: new Date()
      },
      {
        category_id: 5,
        name: "Chocolate Cake",
        description: "Rich chocolate cake.",
        price: 2500.00,
        available: true,
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("menu_items", {
      name: [
        "Classic Beef Burger",
        "Chicken Burger",
        "Chicken Pizza",
        "Beef Pepperoni Pizza",
        "Coca-Cola",
        "Orange Juice",
        "French Fries",
        "Chicken Wings",
        "Chocolate Cake"
      ]
    });
  }
};