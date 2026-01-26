import mongoose from 'mongoose';

const iotDeviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true }, // Hardware ID / Serial Number
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['sensor', 'actuator', 'gateway', 'hybrid'],
        required: true
    },
    category: {
        type: String,
        enum: ['soil', 'weather', 'gps', 'cold_chain', 'machinery', 'energy', 'security'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance', 'retired', 'provisioning'],
        default: 'provisioning'
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // [Longitude, Latitude]
    },
    firmwareVersion: { type: String, default: '1.0.0' },
    lastHeartbeat: { type: Date },
    metadata: { type: Map, of: String }, // Flexible metadata for vendor-specific info
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner/Operator
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Linked Project context

    // Security & Auth
    apiKey: { type: String, select: false }, // For simple auth scenarios
    certFingerprint: { type: String, select: false } // For mTLS scenarios
}, {
    timestamps: true
});

const IoTDevice = mongoose.model('IoTDevice', iotDeviceSchema);
export default IoTDevice;
