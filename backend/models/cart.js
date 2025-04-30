const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CartSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [ItemSchema],
    subTotal: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update lastActive timestamp on cart operations
CartSchema.pre("save", function (next) {
  this.lastActive = Date.now();
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
