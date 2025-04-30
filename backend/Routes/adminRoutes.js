const express = require("express");
const router = express.Router();
const AdminController = require("../Controller/adminController"); // Import the admin controller

// Routes for admin operations
router.post("/register", AdminController.createAdmin); // Register a new admin
router.post("/login", AdminController.loginAdmin); // Login an admin
router.post("/logout", AdminController.logoutAdmin); // Logout an admin
router.get("/", AdminController.getAllAdmins); // Get all admins
router.get("/:id", AdminController.getAdminById); // Get an admin by ID
router.put("/:id", AdminController.updateAdmin); // Update an admin by ID
router.delete("/:id", AdminController.deleteAdmin); // Delete an admin by ID

module.exports = router;
