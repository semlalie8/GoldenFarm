import express from 'express';
import { simulateStrategicBranches, getProjectScenarios, authorizeTimeline } from '../controllers/branchingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/project/:id/sim', protect, admin, simulateStrategicBranches);
router.get('/project/:id', protect, admin, getProjectScenarios);
router.post('/authorize/:id', protect, admin, authorizeTimeline);

export default router;
