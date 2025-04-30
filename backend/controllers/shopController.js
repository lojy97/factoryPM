const Shop = require('../models/shopsModel'); // Import the Shop model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT token generation
const Product = require('../models/productsModel');

const ShopController = {
    // Create a new shop
    createShop: async (req, res) => {
        try {
            const { name, logo, email, password, products } = req.body;

            if (!name || !logo || !email || !password) {
                return res.status(400).json({ message: 'Name, logo, email, and password are required' });
            }

            const existingShop = await Shop.findOne({ email });
            if (existingShop) {
                return res.status(400).json({ message: 'Shop already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newShop = new Shop({
                name,
                logo,
                email,
                password: hashedPassword,
                products: products || [],
            });

            await newShop.save();

            res.status(201).json({
                message: 'Shop created successfully',
                shop: { _id: newShop._id, name: newShop.name, email: newShop.email },
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Login shop
    loginShop: async (req, res) => {
        try {
            const { email, password } = req.body;

            const shop = await Shop.findOne({ email });
            if (shop && (await bcrypt.compare(password, shop.password))) {
                const token = jwt.sign({ id: shop._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000,
                });

                res.status(200).json({
                    _id: shop._id,
                    name: shop.name,
                    email: shop.email,
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Logout shop
    logoutShop: async (req, res) => {
        try {
            res.cookie('jwt', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get all shops
    getAllShops: async (req, res) => {
        try {
            const shops = await Shop.find({});
            res.status(200).json(shops);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get shop by ID
    getShopById: async (req, res) => {
        try {
            const { id } = req.params;

            const shop = await Shop.findById(id);

            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            res.status(200).json(shop);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update shop
    updateShop: async (req, res) => {
        try {
            const { id } = req.params;

            const shop = await Shop.findById(id);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            Object.assign(shop, req.body);
            await shop.save();

            res.status(200).json({ message: 'Shop updated successfully', shop });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Delete shop
    deleteShop: async (req, res) => {
        try {
            const { id } = req.params;

            const shop = await Shop.findById(id);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            await Shop.deleteOne({ _id: id });

            res.status(200).json({ message: 'Shop deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    addProductToShop: async (req, res) => {
        try {
            const { shopId, productId } = req.params;

            // Find the shop by ID
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            // Find the product by ID
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Add the product to the shop's products array
            shop.products.push(product);
            await shop.save();

            res.status(200).json({ message: 'Product added to shop successfully', shop });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Remove a product from the shop's products array
    removeProductFromShop: async (req, res) => {
        try {
            const { shopId, productId } = req.params;

            // Find the shop by ID
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            // Remove the product from the shop's products array
            shop.products = shop.products.filter(
                (product) => product._id.toString() !== productId
            );
            await shop.save();

            res.status(200).json({ message: 'Product removed from shop successfully', shop });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = ShopController;