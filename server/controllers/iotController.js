import asyncHandler from 'express-async-handler';
import iotService from '../services/iotService.js';
import IoTDevice from '../models/iotDeviceModel.js';
import IoTEvent from '../models/iotEventModel.js';

// @desc    Register a new device
// @route   POST /api/iot/devices
// @access  Private/Admin
export const registerDevice = asyncHandler(async (req, res) => {
    const device = await iotService.registerDevice(req.body, req.user._id);
    res.status(201).json(device);
});

// @desc    Ingest Telemetry (Gateway Endpoint)
// @route   POST /api/iot/telemetry
// @access  Public (Protected by API Key in real world, keeping simple for demo)
export const ingestTelemetry = asyncHandler(async (req, res) => {
    const { deviceId, payload } = req.body;

    // Quick validation
    if (!deviceId || !payload) {
        res.status(400);
        throw new Error('Invalid telemetry format');
    }

    const receipt = await iotService.processTelemetry(deviceId, payload);
    res.status(201).json({ success: true, receiptId: receipt._id });
});

// @desc    Get All Devices
// @route   GET /api/iot/devices
// @access  Private
export const getDevices = asyncHandler(async (req, res) => {
    const devices = await IoTDevice.find({});
    res.json(devices);
});

// @desc    Get Active Alerts
// @route   GET /api/iot/alerts
// @access  Private
export const getAlerts = asyncHandler(async (req, res) => {
    const alerts = await IoTEvent.find({ status: { $ne: 'resolved' } }).sort('-createdAt');
    res.json(alerts);
});

// @desc    Get Dashboard Stats
// @route   GET /api/iot/stats
// @access  Private
export const getStats = asyncHandler(async (req, res) => {
    const stats = await iotService.getIoTStats();
    res.json(stats);
});
