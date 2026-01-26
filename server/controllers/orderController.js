import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/sendEmail.js';
import { emitEvent } from '../utils/socket.js';

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    // Validate stock for all items
    for (const item of cart.items) {
        if (!item.product) {
            res.status(400);
            throw new Error('Product no longer exists');
        }
        if (item.product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for ${item.product.name}`);
        }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal * 0.20; // 20% Shipping
    const tax = subtotal * 0.2; // 20% VAT
    const totalAmount = subtotal + shippingFee + tax;

    // Create order items
    const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images?.[0] || ''
    }));

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        tax,
        totalAmount,
        notes,
        status: 'pending',
        isPaid: paymentMethod === 'cod' ? false : false // Will be updated after payment
    });

    // Update product stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity, soldCount: item.quantity }
        });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goldenfarm.ma';
    const itemsList = order.items.map(i => `- ${i.name} x${i.quantity} @ ${i.price} MAD`).join('\n');

    await sendEmail({
        email: adminEmail,
        subject: `🛒 New Order Received: ${order.orderNumber}`,
        message: `A new order has been placed on Golden Farm!

Order Details:
--------------
Order #: ${order.orderNumber}
Customer: ${shippingAddress.fullName}
Phone: ${shippingAddress.phone}
Address: ${shippingAddress.address}, ${shippingAddress.city}

Items:
${itemsList}

Payment Method: ${paymentMethod.toUpperCase()}
Subtotal: ${subtotal} MAD
Shipping: ${shippingFee.toFixed(2)} MAD
Tax: ${tax.toFixed(2)} MAD
TOTAL: ${totalAmount.toFixed(2)} MAD

Please log in to the admin dashboard to process this order.
`
    });

    res.status(201).json({
        message: 'Order placed successfully',
        order
    });

    // Emit real-time event for admin dashboard
    emitEvent('NEW_ORDER', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: shippingAddress.fullName,
        amount: totalAmount
    });
});

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name images');

    res.json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name images');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Only allow user or admin to view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.json(order);
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address || req.body.email
    };
    order.status = 'confirmed';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;

    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    if (status === 'cancelled' || status === 'refunded') {
        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity, soldCount: -item.quantity }
            });
        }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        orders,
        page,
        pages: Math.ceil(total / limit),
        total
    });
});

/**
 * @desc    Get order statistics (Admin)
 * @route   GET /api/orders/stats
 * @access  Private/Admin
 */
export const getOrderStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const revenueAgg = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue
    });
});

/**
 * @desc    Process payment simulation
 * @route   POST /api/orders/:id/process-payment
 * @access  Private
 */
export const processPayment = asyncHandler(async (req, res) => {
    const { paymentMethod, paymentDetails } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Simulate payment processing based on method
    let paymentSuccess = false;
    let paymentResult = {};

    switch (paymentMethod) {
        case 'card':
            // Simulate card payment (in production, integrate with Stripe/PayPal)
            paymentSuccess = true;
            paymentResult = {
                id: `CARD_${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                method: 'Credit Card'
            };
            break;

        case 'paypal':
            // Simulate PayPal (in production, use PayPal SDK)
            paymentSuccess = true;
            paymentResult = {
                id: `PP_${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                method: 'PayPal'
            };
            break;

        case 'bank_transfer':
            // Bank transfer needs manual verification
            paymentSuccess = true;
            paymentResult = {
                id: `BT_${Date.now()}`,
                status: 'PENDING_VERIFICATION',
                update_time: new Date().toISOString(),
                method: 'Bank Transfer'
            };
            order.status = 'pending';
            break;

        case 'mobile_money':
            // Simulate mobile money (Orange Money, M-Pesa, etc.)
            paymentSuccess = true;
            paymentResult = {
                id: `MM_${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                method: 'Mobile Money'
            };
            break;

        case 'cod':
        default:
            // Cash on Delivery
            paymentSuccess = true;
            paymentResult = {
                id: `COD_${Date.now()}`,
                status: 'PAY_ON_DELIVERY',
                update_time: new Date().toISOString(),
                method: 'Cash on Delivery'
            };
            order.status = 'confirmed';
            break;
    }

    if (paymentSuccess) {
        order.paymentResult = paymentResult;
        if (paymentMethod !== 'cod' && paymentMethod !== 'bank_transfer') {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'confirmed';
        }
        await order.save();

        res.json({
            success: true,
            message: 'Payment processed successfully',
            order
        });
    } else {
        res.status(400);
        throw new Error('Payment failed');
    }
});
