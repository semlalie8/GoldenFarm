import mongoose from 'mongoose';

const jobQueueSchema = mongoose.Schema({
    taskType: {
        type: String,
        required: true,
        enum: ['AI_AGENT_TASK', 'ORCHESTRATION_ACTION', 'SYSTEM_MAINTENANCE', 'REPORT_GENERATION']
    },
    payload: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['queued', 'processing', 'completed', 'failed', 'retrying'],
        default: 'queued'
    },
    priority: {
        type: Number,
        default: 0 // Higher = faster
    },
    attempts: {
        type: Number,
        default: 0
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    errorLog: [String],
    scheduledAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Index for efficient polling
jobQueueSchema.index({ status: 1, scheduledAt: 1, priority: -1 });

const JobQueue = mongoose.model('JobQueue', jobQueueSchema);

export default JobQueue;
