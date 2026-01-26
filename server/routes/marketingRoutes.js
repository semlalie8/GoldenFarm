import express from 'express';
import {
    trackEvent,
    getMarketingStats,
    createSegment,
    getCampaigns,
    createCampaign
} from '../controllers/marketingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tracking is public (can be anonymous)
router.post('/track', trackEvent);

// Admin Routes
router.get('/stats', protect, admin, getMarketingStats);
router.route('/campaigns')
    .get(protect, admin, getCampaigns)
    .post(protect, createCampaign);
router.post('/segments', protect, admin, createSegment);

export default router;
