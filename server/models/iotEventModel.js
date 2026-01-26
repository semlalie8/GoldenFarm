import mongoose from 'mongoose';

const iotEventSchema = new mongoose.Schema({
    eventId: { type: String, unique: true, required: true },
    deviceId: { type: String, required: true, index: true },

    // Classification
    eventType: {
        type: String,
        enum: ['alert', 'maintenance', 'utilization', 'compliance', 'system'],
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },

    // Content
    message: { type: String, required: true },
    details: { type: Object }, // Structural context (e.g., threshold violated, sensor value)

    // Lifecycle
    status: {
        type: String,
        enum: ['new', 'acknowledged', 'resolved', 'ignored'],
        default: 'new'
    },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String },
    resolvedAt: { type: Date }
}, {
    timestamps: true
});

const IoTEvent = mongoose.model('IoTEvent', iotEventSchema);
export default IoTEvent;
