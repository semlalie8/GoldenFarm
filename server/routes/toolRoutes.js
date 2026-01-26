import express from 'express';
import { simulateCropYield } from '../controllers/toolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/crop-simulator', protect, simulateCropYield);

export default router;
