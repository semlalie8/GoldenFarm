import asyncHandler from 'express-async-handler';
import Campaign from '../models/Campaign.js';
import { runCampaignSimulation } from '../services/simulationService.js';

/**
 * @desc    Create a new campaign draft
 * @route   POST /api/campaigns
 * @access  Private
 */
export const createCampaign = asyncHandler(async (req, res) => {
    const { title, description, fundingGoal, durationDays } = req.body;

    const campaign = await Campaign.create({
        creator: req.user._id, // Assuming auth middleware populates req.user
        title,
        description,
        fundingGoal,
        durationDays,
        status: 'DRAFT',
        auditLog: [{
            action: 'CREATED',
            performedBy: req.user._id.toString(),
            details: 'Initial Draft'
        }]
    });

    res.status(201).json(campaign);
});

/**
 * @desc    Run simulation and request approval
 * @route   POST /api/campaigns/:id/analyze
 * @access  Private
 */
export const analyzeCampaign = asyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        res.status(404);
        throw new Error('Campaign not found');
    }

    if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Prepare data for the Python Simulation Engine
    const simulationInput = {
        goal_amount: campaign.fundingGoal,
        duration_days: campaign.durationDays,
        avg_ticket_size: 50, // Default assumption, or fetch from rewards
        traffic_daily: 100   // Default assumption, or fetch from creator history
    };

    try {
        campaign.status = 'PENDING_SIMULATION';
        await campaign.save();

        // CALL TO PYTHON ENGINE
        const simulationResults = await runCampaignSimulation(simulationInput);

        // Update Campaign with Authoritative Data
        campaign.simulationData = {
            successProbability: simulationResults.success_probability,
            expectedFunding: simulationResults.expected_funding,
            confidenceInterval90: simulationResults.confidence_interval_90,
            riskLevel: simulationResults.risk_level,
            lastRunAt: new Date()
        };

        // Auto-Governance Rule: If Risk is LOW/MODERATE, Approve. Else, Require Admin.
        if (['LOW', 'MODERATE'].includes(simulationResults.risk_level)) {
            campaign.status = 'APPROVED'; // Ready to be activated by user
        } else {
            campaign.status = 'REJECTED'; // Soft rejection, needs editing
        }

        campaign.auditLog.push({
            action: 'SIMULATION_RUN',
            performedBy: 'SimulationEngine',
            details: simulationResults
        });

        await campaign.save();

        res.json({
            message: 'Simulation Complete',
            results: campaign.simulationData,
            status: campaign.status
        });

    } catch (error) {
        campaign.status = 'DRAFT'; // Revert
        await campaign.save();
        res.status(500);
        throw new Error(`Simulation Failed: ${error.message}`);
    }
});

/**
 * @desc    Launch Campaign (Go Live)
 * @route   POST /api/campaigns/:id/launch
 * @access  Private
 */
export const launchCampaign = asyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        res.status(404);
        throw new Error('Campaign not found');
    }

    if (campaign.status !== 'APPROVED') {
        res.status(400);
        throw new Error(`Campaign cannot be launched. Current status: ${campaign.status}. Run simulation first.`);
    }

    campaign.status = 'ACTIVE';
    campaign.auditLog.push({
        action: 'LAUNCHED',
        performedBy: req.user._id.toString(),
        details: 'Campaign is now live'
    });

    await campaign.save();
    res.json(campaign);
});

/**
 * @desc    Get all campaigns
 * @route   GET /api/campaigns
 * @access  Public
 */
export const getCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find({ status: 'ACTIVE' })
        .populate('creator', 'name')
        .sort('-createdAt');
    res.json(campaigns);
});

/**
 * @desc    Get campaign by ID
 * @route   GET /api/campaigns/:id
 * @access  Public
 */
export const getCampaignById = asyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id).populate('creator', 'name');
    if (campaign) {
        res.json(campaign);
    } else {
        res.status(404);
        throw new Error('Campaign not found');
    }
});
