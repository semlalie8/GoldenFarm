import express from 'express';
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    analyzeCampaign,
    launchCampaign
} from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createCampaign)
    .get(getCampaigns);

router.route('/:id')
    .get(getCampaignById);

// The Core Data-First Workflows
router.post('/:id/analyze', protect, analyzeCampaign);
router.post('/:id/launch', protect, launchCampaign);

export default router;
