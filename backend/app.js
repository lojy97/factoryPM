require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { v4: uuidv4 } = require('uuid');

const app = express();
const db = require("./config/db"); // Make sure this file connects mongoose

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup with MongoDB store
app.use(session({
  genid: function(req) {
    return uuidv4(); // Generate unique session IDs
  },
  secret: process.env.SESSION_SECRET || 'your_secret_key_here',
  resave: false, 
  saveUninitialized: true, // Create a session for every user
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days session expiration
    autoRemove: 'native', // Use MongoDB's TTL collection feature
    crypto: {
      secret: process.env.CRYPTO_SECRET || 'crypto_secret_key'
    }
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Session middleware to ensure the session is available
app.use((req, res, next) => {
  if (req.session) {
    // Store session access time
    req.session.lastAccess = Date.now();
    
    // For debugging and tracking sessions
    console.log(`Session active: ${req.session.id}`);
  }
  next();
});

// Routes
const cartRoutes = require("./routes/cart.routes");
app.use("/cart", cartRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Server error", error: err.message });
});

module.exports = app;