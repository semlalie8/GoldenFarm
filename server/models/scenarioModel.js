import mongoose from 'mongoose';

const scenarioSchema = mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    batchId: {
        type: String, // Groups scenarios generated in the same session
        required: true
    },
    title: {
        type: String, // e.g., "Aggressive Profit Growth" vs "Long-term Soil Health"
        required: true
    },
    narrative: {
        type: String,
        required: true
    },
    riskScore: {
        type: Number,
        default: 5 // 1-10
    },
    financialImpact: {
        type: String, // e.g., "+15% ROI"
        required: true
    },
    sustainabilityImpact: {
        type: String, // e.g., "-5% Water Usage"
        required: true
    },
    proposedActions: [{
        agent: String,
        action: String,
        params: Object
    }],
    status: {
        type: String,
        enum: ['proposed', 'authorized', 'archived'],
        default: 'proposed'
    },
    generatedBy: {
        name: String, // "Neural Core"
        version: String
    }
}, {
    timestamps: true
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

export default Scenario;
