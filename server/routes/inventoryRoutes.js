import express from 'express';
import {
    getInventoryStatus,
    adjustStock,
    receiveGoods,
    getInventoryLogs
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', protect, admin, getInventoryStatus);
router.get('/logs', protect, admin, getInventoryLogs);

router.post('/adjust', protect, admin, adjustStock);
router.post('/receive', protect, admin, receiveGoods);

export default router;
