import express from 'express';
import { runAgentTask, handleN8nUpdate, getAutomationLogs, handleApprovalAction } from '../controllers/automationController.js';
import { getTelemetry, runStressTest, updateAIPrompts } from '../controllers/telemetryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/run-agent', protect, admin, runAgentTask);
router.post('/n8n-webhook', handleN8nUpdate); // Consider adding a secret key middleware here
// Logs & Approvals
router.get('/logs', protect, admin, getAutomationLogs);
router.get('/orchestrations', protect, admin, async (req, res) => {
    const { default: Orchestration } = await import('../models/orchestrationModel.js');
    const jobs = await Orchestration.find().sort({ createdAt: -1 }).limit(10);
    res.json(jobs);
});
router.post('/handle-approval/:id', protect, admin, handleApprovalAction);

// Phase 7: Fine-Tuning & Stress Testing
router.get('/telemetry', protect, admin, getTelemetry);
router.post('/stress-test', protect, admin, runStressTest);
router.post('/fine-tune', protect, admin, updateAIPrompts);

export default router;
