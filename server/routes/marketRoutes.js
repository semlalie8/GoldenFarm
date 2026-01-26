import express from 'express';
import { getMarketSynthesis, getMarketMovers } from '../controllers/marketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/synthesis', protect, getMarketSynthesis);
router.get('/movers', protect, getMarketMovers);

export default router;
