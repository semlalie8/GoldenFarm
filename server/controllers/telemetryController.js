import asyncHandler from 'express-async-handler';
import aiManager from '../services/aiManager.js';
import ragService from '../services/ragService.js';
// Named imports for orchestrationService
import { recordOrchestration } from '../services/orchestrationService.js';
import AutomationLog from '../models/aiLogModel.js';

/**
 * @desc    Get System Health & AI Latency Metrics
 * @route   GET /api/automation/telemetry
 */
export const getTelemetry = asyncHandler(async (req, res) => {
    const logs = await AutomationLog.find().sort({ createdAt: -1 }).limit(50);

    const avgLatency = logs.length > 0
        ? logs.reduce((acc, log) => acc + log.latency, 0) / logs.length
        : 0;

    const failureRate = logs.length > 0
        ? (logs.filter(l => l.executionResult === 'failure').length / logs.length) * 100
        : 0;

    res.json({
        samples: logs.length,
        averageLatency: Math.round(avgLatency),
        failureRate: failureRate.toFixed(2) + '%',
        status: failureRate > 15 ? 'DEGRADED' : 'OPTIMAL'
    });
});

/**
 * @desc    Stress Test the Intelligence Engine
 * @route   POST /api/automation/stress-test
 */
export const runStressTest = asyncHandler(async (req, res) => {
    const start = Date.now();
    const tasks = [
        aiManager.getCompletion({ prompt: "Synthesize global grain security." }),
        aiManager.getEmbeddings("Analyzing soil moisture trends for Argan trees."),
        ragService.retrieveContext("Project Alpha financial stability")
    ];

    const results = await Promise.allSettled(tasks);
    const end = Date.now();

    res.json({
        executionTime: end - start,
        results: results.map((r, i) => ({
            task: i === 0 ? 'LLM' : i === 1 ? 'Embed' : 'RAG',
            status: r.status,
            value: r.status === 'fulfilled' ? 'VALID_LOAD' : r.reason.message
        }))
    });
});

/**
 * @desc    Fine-Tune AI Prompting Parameters
 * @route   POST /api/automation/fine-tune
 */
export const updateAIPrompts = asyncHandler(async (req, res) => {
    // This allows for dynamic prompt injection updates if we move prompts to DB
    // For now, it could be used to clear caches or re-index memories
    if (ragService.reindexAll) await ragService.reindexAll();
    res.json({ message: "AI Synapses re-synchronized and indexed." });
});
