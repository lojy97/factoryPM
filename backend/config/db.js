const mongoose = require("mongoose");
const Cart = require("../models/cart");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Create TTL index on 'lastActive' field of cart collection
    await Cart.collection.createIndex(
      { lastActive: 1 },
      { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
    );
    console.log("Cart TTL index created for cleanup");
  } catch (error) {
    console.error(`❌ DB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
