import express from 'express';
import {
    createTransaction,
    investInProject,
    getMyTransactions,
    getTransactions,
} from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTransaction)
    .get(protect, admin, getTransactions);

router.post('/invest', protect, investInProject);
router.get('/my', protect, getMyTransactions);

export default router;
