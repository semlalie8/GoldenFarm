import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Farmer
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        ...req.body,
        seller: req.user._id
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

export {
    getProducts,
    getProductById,
    createProduct,
};
