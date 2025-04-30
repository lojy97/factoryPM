const Product = require('../models/productsModel'); // Import the Product model

const ProductController = {
    // Create a new product
    createProduct: async (req, res) => {
        try {
            const { Description, ProductName, url, Price, Stock } = req.body;

            if (!Description || !ProductName || !url || !Price ) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newProduct = new Product({
                Description,
                ProductName,
                url,
                Price,
            });

            await newProduct.save();

            res.status(201).json({
                message: 'Product created successfully',
                product: newProduct,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find({});
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get product by ID
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update product
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update the product fields
            Object.assign(product, req.body);
            await product.save();

            res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Delete product
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await Product.deleteOne({ _id: id });

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = ProductController;