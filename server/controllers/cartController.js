import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name image price stock');

        if (!cart) {
            try {
                cart = await Cart.create({ user: req.user._id, items: [] });
            } catch (createError) {
                // Handle race condition where cart was created by another request
                if (createError.code === 11000) {
                    cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name image price stock');
                } else {
                    throw createError;
                }
            }
        }

        res.json(cart);
    } catch (error) {
        console.error('getCart Error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Not enough stock available');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            product: productId,
            quantity,
            price: product.price
        });
    }

    await cart.save();

    // Return populated cart
    cart = await Cart.findById(cart._id).populate('items.product', 'name image price stock');

    res.status(201).json({
        message: 'Item added to cart',
        cart
    });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
        res.status(400);
        throw new Error('Quantity must be at least 1');
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Not enough stock available');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
        res.status(404);
        throw new Error('Item not found in cart');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product', 'name image price stock');

    res.json({
        message: 'Cart updated',
        cart
    });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.product', 'name image price stock');

    res.json({
        message: 'Item removed from cart',
        cart
    });
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = [];
        await cart.save();
    }

    res.json({
        message: 'Cart cleared',
        cart: { items: [], totalAmount: 0 }
    });
});

/**
 * @desc    Get cart count
 * @route   GET /api/cart/count
 * @access  Private
 */
export const getCartCount = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        res.json({ count });
    } catch (error) {
        console.error('getCartCount Error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});
