import express from 'express';
import { pledgeToCampaign } from '../controllers/crowdfundingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pledge', protect, pledgeToCampaign);

export default router;
