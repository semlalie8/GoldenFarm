import asyncHandler from 'express-async-handler';
import { runCropSimulation } from '../services/simulationService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Run Crop Yield Simulation
 * @route   POST /api/tools/crop-simulator
 * @access  Private
 */
export const simulateCropYield = asyncHandler(async (req, res) => {
    // Inputs: crop_type, area_hectares, region (for scraping weather in future)
    const { crop_type, area_hectares, soil_quality_index } = req.body;

    // Step 1: Get Commodity Price from Scraper Data (if available) to inform the Python script?
    // Actually, prompt says "populate marketplace", but here we use it for revenue projection.
    // We'll pass it to Python or Python reads it. For now, Python has benchmarks, but let's check scraper file.

    // Running the simulation
    try {
        const results = await runCropSimulation({
            crop_type,
            area_hectares: Number(area_hectares),
            soil_quality_index: Number(soil_quality_index) || 0.7
        });

        res.json(results);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});
