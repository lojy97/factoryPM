const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController"); // Import the user controller

// Routes for user operations
router.post("/register", UserController.createUser); // Register a new user
router.post("/login", UserController.loginUser); // Login a user
router.post("/logout", UserController.logoutUser); // Logout a user
router.get("/", UserController.getAllUsers); // Get all users
router.get("/:id", UserController.getUserById); // Get a user by ID
router.put("/:id", UserController.updateUser); // Update a user by ID
router.delete("/:id", UserController.deleteUser); // Delete a user by ID

module.exports = router;
