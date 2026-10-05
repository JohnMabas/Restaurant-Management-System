"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Use raw SQL with DO blocks so each constraint is only added if missing
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_price_non_negative'
        ) THEN
          ALTER TABLE menu_items
            ADD CONSTRAINT menu_items_price_non_negative CHECK (price >= 0);
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'orders_total_amount_non_negative'
        ) THEN
          ALTER TABLE orders
            ADD CONSTRAINT orders_total_amount_non_negative CHECK (total_amount >= 0);
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'order_items_quantity_positive'
        ) THEN
          ALTER TABLE order_items
            ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'order_items_unit_price_non_negative'
        ) THEN
          ALTER TABLE order_items
            ADD CONSTRAINT order_items_unit_price_non_negative CHECK (unit_price >= 0);
        END IF;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_menu_item_unique'
        ) THEN
          ALTER TABLE order_items
            ADD CONSTRAINT order_items_order_menu_item_unique UNIQUE (order_id, menu_item_id);
        END IF;
      END $$;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_price_non_negative;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_total_amount_non_negative;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_quantity_positive;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_unit_price_non_negative;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_menu_item_unique;
    `);
  }
};
