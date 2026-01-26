import mongoose from 'mongoose';

const leadSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: String,
    company: String,
    role: {
        type: String,
        enum: ['investor', 'farmer', 'partner', 'sponsor'],
        default: 'investor'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost'],
        default: 'new'
    },
    pipeline: {
        type: String,
        enum: ['institutional_investors', 'brand_partnerships', 'farmer_onboarding'],
        required: true
    },
    estimatedValue: {
        type: Number,
        default: 0
    },
    probability: {
        type: Number,
        default: 10 // Percentage
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastInteraction: {
        type: Date,
        default: Date.now
    },
    notes: [{
        text: String,
        createdAt: { type: Date, default: Date.now },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, {
    timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
