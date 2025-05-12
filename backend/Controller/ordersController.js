import Order from '@/models/Order';
import Product from '@/models/Product';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { buyer, products, totalAmount } = req.body;

        if (!buyer || !products || !totalAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate if products exist
        for (const item of products) {
            const productExists = await Product.findById(item.product);
            if (!productExists) {
                return res.status(404).json({ error: `Product with ID ${item.product} not found` });
            }
        }

        // Generate unique OrderID
        const lastOrder = await Order.findOne().sort({ OrderID: -1 });
        const newOrderID = lastOrder ? lastOrder.OrderID + 1 : 1;

        const newOrder = new Order({
            OrderID: newOrderID,
            buyer,
            products,
            totalAmount,
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('buyer').populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('buyer').populate('products.product');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update order status (for factory/admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete an order (optional)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
