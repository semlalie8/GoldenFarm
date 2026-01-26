import express from 'express';
import { createReport, getReports, verifyReport } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, admin, createReport);
router.get('/', protect, admin, getReports);
router.get('/verify/:reportId', verifyReport);

export default router;
