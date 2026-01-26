import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get all products (Marketplace)
 * @route   GET /api/marketplace/products
 * @access  Public
 */
router.get('/products', asyncHandler(async (req, res) => {
    // Data-First: Only show items with actual stock (if we were strictly enforcing stock validity)
    // For now, list active products
    const products = await Product.find({ status: 'Active' });
    res.json(products);
}));

/**
 * @desc    Get product details
 * @route   GET /api/marketplace/products/:id
 * @access  Public
 */
router.get('/products/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

/**
 * @desc    Create Order (Purchase)
 * @route   POST /api/marketplace/orders
 * @access  Private
 */
router.post('/orders', protect, asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: 'pending' // Simple status, could be event-driven later
        });

        // Loop through items and update stock? 
        // In a real data-first system, we'd use a transaction to lock inventory.
        // Keeping it simple for MVP but acknowledging the gap.

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
}));

export default router;
