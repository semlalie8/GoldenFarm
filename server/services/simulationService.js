import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherService from './weatherService.js';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Docker, the path matches the volume mount. In local dev, it matches the relative path.
// detailed check to see if we are in docker (check for .dockerenv file)
import fs from 'fs';
const isDocker = fs.existsSync('/.dockerenv');

const CROP_SCRIPT_PATH = isDocker
    ? '/simulation_engine/crop_yield_sim.py'
    : path.join(__dirname, '../../simulation_engine/crop_yield_sim.py');

/**
 * Run advanced Agricultural Yield Simulation
 */
export const runCropSimulation = async (cropData) => {
    // Ground in real-world data if location is provided
    let climateContext = null;
    if (cropData.lat && cropData.lon) {
        console.log(`[SimulationService] Grounding simulation in real weather for ${cropData.lat}, ${cropData.lon}`);
        climateContext = await weatherService.getForecast(cropData.lat, cropData.lon);
    }

    const payload = { ...cropData, climate_grounding: climateContext };

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [CROP_SCRIPT_PATH, JSON.stringify(payload)]);

        let resultString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            resultString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Crop Simulation Engine Error: ${errorString}`);
                return reject(new Error('Crop Simulation Engine failed to execute.'));
            }

            try {
                const results = JSON.parse(resultString);
                resolve(results);
            } catch (err) {
                console.error('Failed to parse Crop Simulation Output', resultString);
                reject(new Error('Invalid JSON output from Crop Engine'));
            }
        });
    });
};


/**
 * Service to interface with the Python-based Simulation Engine.
 * Master Prompt Rule: "No forecast without simulation"
 */
export const runCampaignSimulation = async (campaignData) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [PYTHON_SCRIPT_PATH, JSON.stringify(campaignData)]);

        let resultString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            resultString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Simulation Engine Error: ${errorString}`);
                return reject(new Error('Simulation Engine failed to execute.'));
            }

            try {
                const results = JSON.parse(resultString);
                resolve(results);
            } catch (err) {
                console.error('Failed to parse Simulation Output', resultString);
                reject(new Error('Invalid JSON output from Simulation Engine'));
            }
        });
    });
};

/**
 * Validates if an AI prediction is allowed.
 * Returns the Simulation result that overrides the AI.
 */
export const validatePrediction = async (predictionType, data) => {
    // TODO: Connect to more complex simulations
    if (predictionType === 'CONFIDENCE_SCORE') {
        return runCampaignSimulation(data);
    }
    return null;
}
