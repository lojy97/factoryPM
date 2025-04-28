const express = require('express');
const router = express.Router();
const ShopController = require('../Controller/shopController'); // Import the shop controller

// Routes for shop operations
router.post('/', ShopController.createShop); // Create a new shop
router.post('/login', ShopController.loginShop); // Login a shop
router.post('/logout', ShopController.logoutShop); // Logout a shop
router.get('/', ShopController.getAllShops); // Get all shops
router.get('/:id', ShopController.getShopById); // Get a shop by ID
router.put('/:id', ShopController.updateShop); // Update a shop by ID
router.delete('/:id', ShopController.deleteShop); // Delete a shop by ID

// Routes for managing products in a shop
router.post('/:shopId/products/:productId', ShopController.addProductToShop); // Add a product to a shop
router.delete('/:shopId/products/:productId', ShopController.removeProductFromShop); // Remove a product from a shop

module.exports = router;