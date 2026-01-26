import express from 'express';
import { getMarketPrices, getAdminStats, getLoginHistory } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/market-prices', getMarketPrices);
router.get('/admin', protect, admin, getAdminStats);
router.get('/logins', protect, admin, getLoginHistory);

export default router;
