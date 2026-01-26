import express from 'express';
import {
    getProjectStrategicConsensus,
    getGlobalStrategicConsensus,
    executeProposedTask,
    getNeuralMemories
} from '../controllers/intelligenceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/health', (req, res) => res.send('Intelligence Layer Live'));
router.post('/project/:id/analyze', protect, getProjectStrategicConsensus);
router.post('/global/analyze', protect, getGlobalStrategicConsensus);
router.post('/execute-task', protect, executeProposedTask);
router.get('/memories', protect, admin, getNeuralMemories);

export default router;
