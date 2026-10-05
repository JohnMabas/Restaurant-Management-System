
const { MenuItem, Category } = require("../models");

// GET /api/menu-items
async function getMenuItems(req, res) {
  try {
    const menuItems = await MenuItem.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ],
      order: [["name", "ASC"]]
    });

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu items"
    });
  }
}

// GET /api/menu-items/:id
async function getMenuItemById(req, res) {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ]
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch menu item"
    });
  }
}

// POST /api/menu-items
async function createMenuItem(req, res) {
  try {
    const {
      categoryId,
      name,
      description,
      price,
      available
    } = req.body;

    if (!categoryId || !name || price === undefined) {
      return res.status(400).json({
        message: "categoryId, name and price are required"
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative"
      });
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    const menuItem = await MenuItem.create({
      categoryId,
      name,
      description,
      price,
      available
    });

    const createdMenuItem = await MenuItem.findByPk(menuItem.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ]
    });

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: createdMenuItem
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create menu item"
    });
  }
}

// PUT /api/menu-items/:id
async function updateMenuItem(req, res) {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    const {
      categoryId,
      name,
      description,
      price,
      available
    } = req.body;

    if (categoryId !== undefined) {
      const category = await Category.findByPk(categoryId);

      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative"
      });
    }

    await menuItem.update({
      categoryId,
      name,
      description,
      price,
      available
    });

    const updatedMenuItem = await MenuItem.findByPk(menuItem.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ]
    });

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update menu item"
    });
  }
}

// DELETE /api/menu-items/:id
async function deleteMenuItem(req, res) {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    await menuItem.destroy();

    res.status(200).json({
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete menu item"
    });
  }
}

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};