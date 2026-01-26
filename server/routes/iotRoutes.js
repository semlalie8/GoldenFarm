import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    registerDevice,
    ingestTelemetry,
    getDevices,
    getAlerts,
    getStats
} from '../controllers/iotController.js';

const router = express.Router();

// Device Management
router.route('/devices')
    .post(protect, admin, registerDevice)
    .get(protect, getDevices);

// Telemetry Ingestion (High Throughput)
router.post('/telemetry', ingestTelemetry);

// Operational Views
router.get('/alerts', protect, getAlerts);
router.get('/stats', protect, getStats);

export default router;
