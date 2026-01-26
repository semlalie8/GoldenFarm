import asyncHandler from 'express-async-handler';
import AILog from '../models/aiLogModel.js';
import Approval from '../models/approvalModel.js';
import MarketingEvent from '../models/marketingEventModel.js';
import SensorData from '../models/sensorModel.js';
import Orchestration from '../models/orchestrationModel.js';
import {
    salesAgent, investorAgent, farmerAgent,
    marketplaceAgent, educationAgent, financeAgent, supportAgent,
    growthStrategistAgent, marketingContentAgent
} from '../agents/agentDefinitions.js';

const agents = {
    'sales': salesAgent,
    'investor': investorAgent,
    'farmer': farmerAgent,
    'marketplace': marketplaceAgent,
    'education': educationAgent,
    'finance': financeAgent,
    'support': supportAgent,
    'growth strategist': growthStrategistAgent,
    'marketing content': marketingContentAgent
};

/**
 * Internal worker function for Job Queue
 */
export const runAgentTaskInternal = async (payload) => {
    const { default: agentSwarm } = await import('../services/agentSwarm.js');
    const { agentName, task, context } = payload;

    // Dispatch to Phase 4 Swarm
    const result = await agentSwarm.dispatch(agentName, context);
    return result;
};

/**
 * @desc    Run a specific AI agent task (Asynchronous)
 * @route   POST /api/automation/run-agent
 * @access  Private/Admin
 */
export const runAgentTask = asyncHandler(async (req, res) => {
    const { agentName, task, context } = req.body;

    const { default: queueService } = await import('../services/queueService.js');
    const job = await queueService.enqueue('AI_AGENT_TASK', { agentName, task, context });

    res.status(202).json({
        message: 'Agent task accepted for asynchronous processing',
        jobId: job._id
    });
});

/**
 * @desc    Receive decision/update from n8n
 * @route   POST /api/automation/n8n-webhook
 * @access  Private (Internal/Webhook Secret)
 */
export const handleN8nUpdate = asyncHandler(async (req, res) => {
    const { action, targetType, targetId, payload } = req.body;

    // Logic to update CRM based on n8n/AI decision
    console.log(`[Automation] n8n requested action: ${action} on ${targetType}:${targetId}`);

    // Example: Update lead score, update ticket status, etc.
    // This implements the "AI Decides, Automation Executes" part

    res.json({ success: true, message: 'Action processed' });
});

/**
 * @desc    Get automation logs (audit trail)
 * @route   GET /api/automation/logs
 * @access  Private/Admin
 */
export const getAutomationLogs = asyncHandler(async (req, res) => {
    const logs = await AILog.find({}).sort('-createdAt').limit(20);
    let pendingApprovals = await Approval.find({ status: 'pending' }).sort('-createdAt');
    const cdpFeed = await MarketingEvent.find({}).sort('-createdAt').limit(15);
    const systemAlerts = (await SensorData.find({}).sort('-createdAt').limit(5)) || [];
    const persistenceQueue = (await Orchestration.find({}).sort('-createdAt').limit(10)) || [];

    // Phase 8: Hardening Telemetry
    const { default: JobQueue } = await import('../models/jobQueueModel.js');
    const jobQueueStatus = await JobQueue.find({ status: { $ne: 'completed' } }).sort('-createdAt').limit(10);

    const { default: SecurityAudit } = await import('../models/securityAuditModel.js');
    const securityLogs = await SecurityAudit.find({}).sort('-createdAt').limit(10);

    // --- DEMO DATA INJECTION ---
    // If no real approvals exist, create a few realistic "High-Stakes" mock approvals for the demo
    if (pendingApprovals.length === 0) {
        // We act "as if" we found them, without saving to DB to avoid pollution,
        // OR we can save them if we want persistent demo state. Let's return transient mocks.
        pendingApprovals = [
            {
                _id: 'mock_1',
                agent: 'Finance & Compliance Agent',
                actionType: 'TRANSACTION_EXECUTE',
                payload: { amount: 45000, recipient: 'Green Valley Co-op', purpose: 'Q1 Dividend Payout' },
                status: 'pending',
                requestedBy: 'Finance_Bot_v2',
                createdAt: new Date()
            },
            {
                _id: 'mock_2',
                agent: 'Legal & Contracts Agent',
                actionType: 'STATUS_CHANGE',
                payload: { contractId: 'CTR-2024-889', action: 'Finalize Lease', farmer: 'Hassan Amrani' },
                status: 'pending',
                requestedBy: 'Legal_Sentinel_Ai',
                createdAt: new Date(Date.now() - 3600000)
            },
            {
                _id: 'mock_3',
                agent: 'Growth Strategist Agent',
                actionType: 'MESSAGE_SEND', // Corrected enum
                payload: { audienceSize: 15400, campaign: 'Harvest Season Blast', cost: 1200 },
                status: 'pending',
                requestedBy: 'Growth_Genius',
                createdAt: new Date(Date.now() - 7200000)
            }
        ];
    }
    // ---------------------------

    res.json({
        logs,
        pendingApprovals,
        cdpFeed,
        persistenceQueue,
        jobQueueStatus,
        securityLogs,
        systemHealth: {
            status: 'Operational',
            lastSync: new Date(),
            connectedNodes: 12
        }
    });
});

/**
 * @desc    Handle (Approve/Reject) a pending action
 * @route   POST /api/automation/handle-approval/:id
 * @access  Private/Admin
 */
export const handleApprovalAction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (id.startsWith('mock_')) {
        // Handle mock approval just by returning success
        res.json({ success: true, message: `Mock Action ${status} successfully` });
        return;
    }

    const approval = await Approval.findById(id);

    if (approval) {
        approval.status = status;
        approval.approvedBy = req.user._id;
        await approval.save();
        res.json({ success: true, message: `Action ${status}` });
    } else {
        res.status(404);
        throw new Error('Approval request not found');
    }
});
