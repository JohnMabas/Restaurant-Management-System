
const { User } = require("../models");
const bcrypt = require("bcryptjs");

// GET /api/users
async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"]
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
}

// GET /api/users/:id
async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"]
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
}

// POST /api/users
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
}

// PUT /api/users/:id
async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user"
    });
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete user"
    });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};