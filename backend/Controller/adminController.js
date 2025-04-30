const Admin = require("../models/adminModel"); // Import the Admin model
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT token generation

const AdminController = {
  // Create a new admin
  createAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ Email: email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new admin
      const newAdmin = new Admin({
        Name: name,
        Email: email,
        Password: hashedPassword,
      });

      // Save the admin to the database
      await newAdmin.save();

      res.status(201).json({
        message: "Admin created successfully",
        admin: {
          _id: newAdmin._id,
          name: newAdmin.Name,
          email: newAdmin.Email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Login admin
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ Email: email });
      if (admin && (await bcrypt.compare(password, admin.Password))) {
        const token = jwt.sign(
          { id: admin._id, type: "admin" },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          _id: admin._id,
          name: admin.Name,
          email: admin.Email,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Logout admin
  logoutAdmin: async (req, res) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all admins
  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find({});
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get admin by ID
  getAdminById: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update admin
  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.Password = await bcrypt.hash(password, salt);
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        {
          Name: name || admin.Name,
          Email: email || admin.Email,
          Password: req.body.Password || admin.Password,
        },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Admin updated successfully", admin: updatedAdmin });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete admin
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the admin by ID
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Delete the admin using deleteOne
      await Admin.deleteOne({ _id: id });

      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = AdminController;
