import mongoose from 'mongoose';

const sensorDataSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project',
    },
    sensorType: {
        type: String,
        required: true,
        enum: ['temperature', 'humidity', 'location', 'heartrate', 'weight'],
    },
    value: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;
