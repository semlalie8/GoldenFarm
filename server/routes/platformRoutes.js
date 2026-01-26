import express from 'express';
import { getPlatformAnalytics, getModuleAnalytics } from '../controllers/platformController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Unified platform analytics endpoint
router.get('/analytics', protect, admin, getPlatformAnalytics);

// Module-specific deep analytics
router.get('/module/:module', protect, admin, getModuleAnalytics);

export default router;
