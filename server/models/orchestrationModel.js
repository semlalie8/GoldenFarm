import mongoose from 'mongoose';

const orchestrationSchema = mongoose.Schema({
    eventId: {
        type: String,
        required: true,
        unique: true
    },
    eventType: {
        type: String, // e.g., 'transaction.completed', 'sensor.alert'
        required: true
    },
    payload: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    attempts: {
        type: Number,
        default: 0
    },
    lastError: String,
    completedAt: Date
}, {
    timestamps: true
});

const Orchestration = mongoose.model('Orchestration', orchestrationSchema);

export default Orchestration;
