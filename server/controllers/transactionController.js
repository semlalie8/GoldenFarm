import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import * as transactionService from '../services/transactionService.js';

// @desc    Create a transaction (Deposit/Withdraw)
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
    const { type, amount, description, paymentMethod } = req.body;

    if (type === 'deposit') {
        const transaction = await transactionService.depositFunds(
            req.user._id,
            amount,
            paymentMethod,
            description
        );
        return res.status(201).json(transaction);
    }

    // Generic transaction logic for other types if any
    const transaction = await Transaction.create({
        user: req.user._id,
        type,
        amount,
        description,
        paymentMethod,
        status: 'pending'
    });

    res.status(201).json(transaction);
});

// @desc    Invest in a project
// @route   POST /api/transactions/invest
// @access  Private
const investInProject = asyncHandler(async (req, res) => {
    const { projectId, amount } = req.body;
    const transaction = await transactionService.investInProject(
        req.user._id,
        projectId,
        amount
    );
    res.status(201).json(transaction);
});

// @desc    Get user transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
});

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({}).populate('user', 'name email');
    res.json(transactions);
});

export {
    createTransaction,
    investInProject,
    getMyTransactions,
    getTransactions,
};
