const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../auth.middleware');

// Apply authentication middleware to all cart routes
router.use(authenticate);

// Get cart contents
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addItemToCart);

// Update item quantity
router.put('/update/:productId', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeItemFromCart);

// Empty cart
router.delete('/empty', cartController.emptyCart);

// Checkout
router.post('/checkout', cartController.checkout);

module.exports = router;