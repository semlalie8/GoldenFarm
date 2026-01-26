import asyncHandler from 'express-async-handler';
import branchingService from '../services/branchingService.js';
import Scenario from '../models/scenarioModel.js';

/**
 * @desc    Generate divergent timelines for a project
 * @route   POST /api/branching/project/:id/sim
 */
export const simulateStrategicBranches = asyncHandler(async (req, res) => {
    const { context } = req.body;
    const result = await branchingService.generateDivergentTimelines(req.params.id, context);
    res.json(result);
});

/**
 * @desc    Get scenarios for a project
 * @route   GET /api/branching/project/:id
 */
export const getProjectScenarios = asyncHandler(async (req, res) => {
    const scenarios = await Scenario.find({
        projectId: req.params.id,
        status: { $ne: 'archived' }
    }).sort('-createdAt');
    res.json(scenarios);
});

/**
 * @desc    Authorize a specific timeline
 * @route   POST /api/branching/authorize/:id
 */
export const authorizeTimeline = asyncHandler(async (req, res) => {
    const scenario = await branchingService.authorizeTimeline(req.params.id, req.user._id);
    res.json({
        success: true,
        message: `Timeline "${scenario.title}" has been authorized for execution.`,
        scenario
    });
});
