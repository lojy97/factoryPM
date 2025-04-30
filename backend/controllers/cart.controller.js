const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      // If no cart exists for this session, create an empty one
      cart = new Cart({
        sessionId: req.session.id,
        items: [],
        subTotal: 0,
      });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  const { productId, quantity, price, name } = req.body;

  // Validate inputs
  if (!productId || !quantity || !price) {
    return res
      .status(400)
      .json({ msg: "Missing productId, quantity, or price" });
  }

  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({
        sessionId: req.session.id,
        items: [],
        subTotal: 0,
      });
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      // Update existing item
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].total =
        cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: name || "Product", // Store product name for better UX
        quantity,
        price,
        total: quantity * price,
      });
    }

    // Recalculate cart total
    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
    await cart.save();

    res.status(200).json({
      type: "Success",
      msg: "Item added to cart",
      data: cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ msg: "Quantity must be at least 1" });
  }

  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ type: "Not Found", msg: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ type: "Not Found", msg: "Item not found in cart" });
    }

    // Update item quantity and total
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

    // Recalculate cart subtotal
    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
    await cart.save();

    res.status(200).json({
      type: "Success",
      msg: "Cart item updated",
      data: cart,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ type: "Error", msg: "Server error", error: err.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ type: "Not Found", msg: "Cart not found" });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ type: "Not Found", msg: "Item not found in cart" });
    }

    // Remove item from cart
    cart.items.splice(itemIndex, 1);

    // Recalculate cart subtotal
    cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
    await cart.save();

    res.status(200).json({
      type: "Success",
      msg: "Item removed from cart",
      data: cart,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ type: "Error", msg: "Server error", error: err.message });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ type: "Not Found", msg: "Cart not found" });
    }

    // Empty cart
    cart.items = [];
    cart.subTotal = 0;
    await cart.save();

    res.status(200).json({
      type: "Success",
      msg: "Cart emptied",
      data: cart,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ type: "Error", msg: "Server error", error: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    // Find cart by session ID
    let cart = await Cart.findOne({ sessionId: req.session.id });

    if (!cart) {
      return res.status(404).json({ type: "Not Found", msg: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ type: "Error", msg: "Cart is empty" });
    }

    // Fetch the Product model - assuming it's defined elsewhere in your application
    const Product = require("../models/product");

    // Check inventory and update product stock
    const stockUpdates = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          type: "Error",
          msg: `Product not found: ${item.productId}`,
        });
      }

      if (product.Stock < item.quantity) {
        return res.status(400).json({
          type: "Error",
          msg: `Not enough stock for ${product.ProductName}. Available: ${product.Stock}`,
        });
      }

      // Update product stock
      product.Stock -= item.quantity;
      stockUpdates.push(product.save());
    }

    // Wait for all stock updates to complete
    await Promise.all(stockUpdates);

    // Here you would typically:
    // 1. Process payment
    // 2. Create order in database

    // Return success response
    res.status(200).json({
      type: "Success",
      msg: "Checkout successful",
      orderTotal: cart.subTotal,
      items: cart.items,
    });

    // Clear the cart after checkout
    cart.items = [];
    cart.subTotal = 0;
    await cart.save();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ type: "Error", msg: "Server error", error: err.message });
  }
};
