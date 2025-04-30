const User = require("../models/userModel"); // Import the User model
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For JWT token generation

console.log(require.resolve("../models/userModel"));

const UserController = {
  // Create a new user
  createUser: async (req, res) => {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      const existingUser = await User.findOne({ Email: email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        Name: name, // Match the schema field name
        Email: email, // Match the schema field name
        Password: hashedPassword, // Match the schema field name
        Phone: phone || null,
        Address: address || null,
      });

      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          Id: newUser.Id,
          name: newUser.Name,
          email: newUser.Email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Use the correct field name 'Email' as defined in the schema
      const user = await User.findOne({ Email: email });
      if (user && (await bcrypt.compare(password, user.Password))) {
        // Generate a JWT token
        const token = jwt.sign(
          { id: user._id, type: "user" },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d", // Token expires in 1 day
          }
        );

        // Save the token in a cookie
        res.cookie("jwt", token, {
          httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        res.status(200).json({
          _id: user._id,
          name: user.Name, // Match the schema field name
          email: user.Email, // Match the schema field name
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Logout user
  logoutUser: async (req, res) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Search by the custom 'Id' field instead of '_id'
      const user = await User.findOne({ Id: id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Search by the custom 'Id' field instead of '_id'
      const user = await User.findOne({ Id: id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.Password = await bcrypt.hash(req.body.password, salt);
      }

      // Update the user fields
      Object.assign(user, req.body);
      await user.save();

      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Search by the custom 'Id' field instead of '_id'
      const user = await User.findOne({ Id: id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Use deleteOne to remove the user
      await User.deleteOne({ Id: id });

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = UserController;
