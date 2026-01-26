import asyncHandler from 'express-async-handler';
import aiManager from '../services/aiManager.js';
import AILog from '../models/aiLogModel.js';

/**
 * @desc    Analyze a farm-related image (Crop health, invoice, etc.)
 * @route   POST /api/vision/analyze
 * @access  Private/Admin
 */
export const analyzeFarmImage = asyncHandler(async (req, res) => {
    const { image, prompt, category } = req.body;

    if (!image) {
        res.status(400);
        throw new Error('Image data is required');
    }

    const start = Date.now();
    const result = await aiManager.analyzeImage(image, prompt || "Analyze this agricultural image. Identify crop health, irrigation status, or any visible anomalies.");
    const latency = Date.now() - start;

    // Log the visual analysis
    await AILog.create({
        agentName: 'NeuralVision_Core',
        input: `Vision Analysis: ${category || 'General'}`,
        output: result,
        executionResult: result.includes('VISION_OFFLINE') ? 'failure' : 'success',
        latency
    });

    res.json({
        success: true,
        analysis: result,
        latency
    });
});
