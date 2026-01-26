import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    description: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    category: {
        type: String,
        required: true,
        enum: ['livestock', 'agriculture', 'equipment', 'other'],
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    backerCount: {
        type: Number,
        default: 0,
    },
    minInvestment: {
        type: Number,
        default: 10,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending',
    },
    images: [{
        type: String,
    }],
    roi: { // Return on Investment estimate
        type: Number,
        default: 0
    },
    durationMonths: {
        type: Number,
        required: true
    },
    location: {
        type: String,
    },
    latitude: {
        type: Number,
        default: 33.5731 // Default to Casablanca area for mock
    },
    longitude: {
        type: Number,
        default: -7.5898
    },
    iotDeviceId: {
        type: String,
        default: "GENERIC_FARM_001"
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very_high'],
        default: 'medium'
    },
    yieldProjection: {
        type: String,
        required: false
    },
    milestones: [{
        title: String,
        description: String,
        targetDate: Date,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        }
    }]
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
