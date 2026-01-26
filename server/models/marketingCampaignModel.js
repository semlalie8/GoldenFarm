import mongoose from 'mongoose';

const marketingCampaignSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['email', 'sms', 'social', 'multi-channel', 'automation'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'completed'],
        default: 'draft'
    },
    objective: { type: String }, // e.g., 'acquisition', 'retention', 'referral'

    // Audience Targeting
    targetSegment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarketingSegment'
    },

    // Orchestration Flow
    steps: [{
        order: Number,
        channel: String,
        contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketingContent' },
        delay: Number, // delay in hours from previous step
        conditions: Object // Logic for logic-based steps (e.g., "if clicked")
    }],

    // Performance Metrics
    metrics: {
        sent: { type: Number, default: 0 },
        delivered: { type: Number, default: 0 },
        opened: { type: Number, default: 0 },
        clicked: { type: Number, default: 0 },
        converted: { type: Number, default: 0 },
        spent: { type: Number, default: 0 },
        revenueGenerated: { type: Number, default: 0 }
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

const MarketingCampaign = mongoose.model('MarketingCampaign', marketingCampaignSchema);
export default MarketingCampaign;
