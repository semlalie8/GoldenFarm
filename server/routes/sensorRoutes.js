import express from 'express';
import asyncHandler from 'express-async-handler';
import SensorData from '../models/sensorModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import eventBus from '../utils/eventBus.js';

const router = express.Router();

// @desc    Post sensor data (IoT integration)
// @route   POST /api/sensors
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { project, sensorType, value, unit } = req.body;

    const sensorEntry = new SensorData({
        project,
        sensorType,
        value,
        unit
    });

    const createdEntry = await sensorEntry.save();

    // Hyper-Connectivity: Trigger alerts if values are out of bounds
    // Example thresholds
    const thresholds = {
        'temperature': { max: 40, min: 0 },
        'humidity': { max: 80, min: 20 },
        'soil_moisture': { min: 30 }
    };

    const limit = thresholds[sensorType];
    if (limit) {
        if ((limit.max && value > limit.max) || (limit.min && value < limit.min)) {
            eventBus.emit('sensor.alert', {
                sensorId: createdEntry._id,
                sensorType,
                value,
                location: project, // Project ID as location
                message: `Out of bounds: ${value}${unit} (Limits: ${limit.min || 'N/A'}-${limit.max || 'N/A'})`
            });
        }
    }

    // In a real scenario, we would also emit a socket.io event here
    const io = req.app.get('io');
    if (io) {
        io.to(project.toString()).emit('sensorUpdate', createdEntry);
    }

    res.status(201).json(createdEntry);
}));

// @desc    Get sensor data for a project
// @route   GET /api/sensors/:projectId
// @access  Public
router.get('/:projectId', asyncHandler(async (req, res) => {
    const data = await SensorData.find({ project: req.params.projectId })
        .sort({ timestamp: -1 })
        .limit(100);
    res.json(data);
}));

export default router;
