import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import authorize, { ROLES } from '../middleware/rbacMiddleware.js';
import * as financeService from '../services/financeService.js';
import { Account, JournalEntry } from '../models/financeModel.js';
import asyncHandler from 'express-async-handler';
import auditService from '../services/auditService.js';

const router = express.Router();

// Chart of Accounts
router.get('/accounts', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const accounts = await Account.find({}).sort('code');
    res.json(accounts);
}));

router.post('/accounts', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const account = await Account.create(req.body);
    res.status(201).json(account);
}));

// General Ledger (Journal Entries)
router.get('/journal', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const entries = await JournalEntry.find({})
        .populate('lines.account', 'code name')
        .sort('-date')
        .limit(100);
    res.json(entries);
}));

// Manual Journal Entry
router.post('/journal', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const entry = await financeService.postJournalEntry({
        ...req.body,
        sourceModule: 'manual'
    });

    await auditService.log({
        user: req.user._id,
        action: 'JOURNAL_ENTRY_CREATE',
        module: 'FINANCE',
        details: { reference: entry.reference, totalValue: req.body.totalAmount },
        req
    });

    res.status(201).json(entry);
}));

// Financial Reports (Balance Sheet / Income Statement)
// Simplified for MVP
router.get('/reports/trial-balance', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const accounts = await Account.find({});
    const trialBalance = accounts.map(acc => ({
        code: acc.code,
        name: acc.name,
        balance: acc.balance,
        type: acc.type
    }));
    res.json(trialBalance);
}));

// --- NEW CGI 2026 NODES ---

// @desc    Get real-time TVA Position
// @route   GET /api/v1/finance/tva-status
router.get('/tva-status', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const status = await financeService.default.calculateTVAPosition(
        startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate || new Date()
    );
    res.json(status);
}));

// @desc    Simulate Fiscal Impact of a transaction
// @route   POST /api/v1/finance/simulate
router.post('/simulate', protect, authorize(ROLES.ACCOUNTING), asyncHandler(async (req, res) => {
    const { amount, category } = req.body;
    const simulation = financeService.default.simulateFiscalImpact(amount, category);
    res.json(simulation);
}));

export default router;
