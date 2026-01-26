import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fundingGoal: {
        type: Number,
        required: true,
        min: 1
    },
    durationDays: {
        type: Number,
        required: true,
        min: 1,
        max: 90
    },
    currentFunding: {
        type: Number,
        default: 0
    },
    backerCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING_SIMULATION', 'APPROVED', 'REJECTED', 'ACTIVE', 'FUNDED', 'FAILED'],
        default: 'DRAFT'
    },
    // MASTER PROMPT REQUIREMENT: "No forecast without simulation"
    simulationData: {
        successProbability: { type: Number },
        expectedFunding: { type: Number },
        confidenceInterval90: [{ type: Number }], // [Low, High]
        riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
        lastRunAt: { type: Date }
    },
    // Lineage & Governance
    auditLog: [{
        action: { type: String, required: true },
        performedBy: { type: String }, // 'User', 'SimulationEngine', 'System'
        timestamp: { type: Date, default: Date.now },
        details: { type: mongoose.Schema.Types.Mixed }
    }]
}, {
    timestamps: true
});

// Middleware to enforce simulation governance
campaignSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'ACTIVE') {
        if (!this.simulationData || !this.simulationData.lastRunAt) {
            return next(new Error('VIOLATION: Cannot activate campaign without valid simulation data.'));
        }
    }
    next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
