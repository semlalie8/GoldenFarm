import mongoose from 'mongoose';

const aiLogSchema = mongoose.Schema({
    agentName: {
        type: String,
        required: true
    },
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    decision: {
        type: String
    },
    executionResult: {
        type: String,
        enum: ['success', 'failure', 'pending_approval'],
        default: 'success'
    },
    metadata: {
        type: Object
    },
    latency: {
        type: Number // in ms
    }
}, {
    timestamps: true
});

const AILog = mongoose.model('AILog', aiLogSchema);

export default AILog;
