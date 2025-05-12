import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from '@/controllers/orderController';

const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

// Update order status
router.put('/:id', updateOrderStatus);

// Delete an order
router.delete('/:id', deleteOrder);

export default router;
