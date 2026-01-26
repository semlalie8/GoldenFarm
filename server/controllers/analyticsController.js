/**
 * @desc    Get Competitor Market Analysis
 * @route   GET /api/analytics/market-prices
 * @access  Public
 */
import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Transaction from '../models/transactionModel.js';
import LoginHistory from '../models/loginHistoryModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();

    const transactions = await Transaction.find({ status: 'completed' });
    const totalRevenue = transactions.reduce((acc, item) => acc + item.amount, 0);

    res.json({
        totalUsers,
        totalProjects,
        totalRevenue
    });
});

export const getMarketPrices = asyncHandler(async (req, res) => {
    // Data-First: Read directly from the Scraper's output
    // In production, this would read from a DB table populated by the scraper
    const dataPath = path.join(__dirname, '../../data_pipeline/raw_data/competitor_prices.json');

    try {
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf-8');
            const prices = JSON.parse(rawData);
            res.json(prices);
        } else {
            // Return empty or default if scraper hasn't run
            res.json([]);
        }
    } catch (error) {
        console.error("Failed to read market data", error);
        res.status(500).json({ message: "Market data unavailable" });
    }
});

/**
 * @desc    Get detailed login history with stats
 * @route   GET /api/analytics/logins
 * @access  Private/Admin
 */
export const getLoginHistory = asyncHandler(async (req, res) => {
    const logs = await LoginHistory.find({})
        .populate('user', 'name email role avatar')
        .sort({ loginTime: -1 })
        .limit(100);

    // Calculate basic stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 1);

    const dailyLogins = await LoginHistory.countDocuments({ loginTime: { $gte: todayStart } });
    const weeklyLogins = await LoginHistory.countDocuments({ loginTime: { $gte: weekStart } });
    const monthlyLogins = await LoginHistory.countDocuments({ loginTime: { $gte: monthStart } });

    res.json({
        logs,
        stats: {
            daily: dailyLogins,
            weekly: weeklyLogins,
            monthly: monthlyLogins
        }
    });
});

