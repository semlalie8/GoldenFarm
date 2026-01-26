import express from 'express';
import { analyzeFarmImage } from '../controllers/visionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, admin, analyzeFarmImage);

export default router;
