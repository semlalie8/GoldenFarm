import mongoose from 'mongoose';

const iotTelemetrySchema = new mongoose.Schema({
    deviceId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },

    // Data Types
    type: { type: String, required: true }, // e.g., 'temperature', 'humidity', 'fuel_level'
    value: { type: Number, required: true },
    unit: { type: String },

    // Quality & Audit
    quality: { type: String, enum: ['good', 'bad', 'uncertain'], default: 'good' },
    sourceIp: { type: String }, // For audit

    // Raw Storage (Optional, for debugging/replay)
    rawPayload: { type: Object }
}, {
    timestamps: false, // We use 'timestamp' field
    // MongoDB 5.0+ Time Series Optimization (automatically handled if supported)
    timeseries: {
        timeField: 'timestamp',
        metaField: 'deviceId',
        granularity: 'minutes'
    }
});

const IoTTelemetry = mongoose.model('IoTTelemetry', iotTelemetrySchema);
export default IoTTelemetry;
