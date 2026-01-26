import asyncHandler from 'express-async-handler';
import aiManager from '../services/aiManager.js';
import * as agentDefinitions from '../agents/agentDefinitions.js';

/**
 * @desc    Chat with a specific AI Agent (supports Tool Use)
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chatWithAgent = asyncHandler(async (req, res) => {
    const { message, agent, context } = req.body;
    console.log(`[AI Controller] Chat request for agent: ${agent}`);
    console.log(`[AI Controller] Message: ${message}`);

    // Resolve the agent object from string name
    const selectedAgent = Object.values(agentDefinitions).find(a => a.name === agent);

    if (!selectedAgent) {
        res.status(404);
        throw new Error(`Agent '${agent}' not found.`);
    }

    try {
        // DATA-FIRST: Inject platform statistics automatically to ground the AI
        const { default: User } = await import('../models/userModel.js');
        const { default: Project } = await import('../models/projectModel.js');
        const { default: Lead } = await import('../models/leadModel.js');

        // Fetch stats in parallel for speed
        const [userCount, projectCount, leadCount] = await Promise.all([
            User.countDocuments(),
            Project.countDocuments(),
            Lead.countDocuments()
        ]);

        const platformContext = {
            platform_stats: {
                total_users: userCount,
                active_projects: projectCount,
                crm_leads: leadCount
            },
            system_time: new Date().toISOString(),
            authority_chain: "Real-world data -> Statistical analysis -> AI explanation"
        };

        const finalContext = {
            ...platformContext,
            ...context,
            user: req.user ? req.user.name : "Guest Visitor",
            is_guest: !req.user
        };

        const result = await selectedAgent.runTask(message, finalContext);

        res.json(result);

    } catch (error) {
        console.error('Agent Chat Error:', error);
        res.status(500);
        throw new Error('AI Agent failed to respond. Check Ollama or Cloud connection.');
    }
});
