import mongoose from 'mongoose';

const marketingEventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be anonymous if using distinctId
    },
    distinctId: { type: String, required: true }, // For tracking anonymous visitors

    event: { type: String, required: true }, // e.g., 'PAGE_VIEW', 'BUTTON_CLICK', 'ORDER_START'
    properties: { type: Object, default: {} }, // Metadata (URL, ProductID, etc.)

    // Context
    ip: String,
    userAgent: String,
    channel: { type: String, enum: ['direct', 'organic', 'social', 'paid', 'referral'] },

    utm_source: String,
    utm_medium: String,
    utm_campaign: String
}, {
    timestamps: true
});

// Indexing for high-speed funnel analysis
marketingEventSchema.index({ event: 1, createdAt: -1 });
marketingEventSchema.index({ user: 1, event: 1 });

const MarketingEvent = mongoose.model('MarketingEvent', marketingEventSchema);
export default MarketingEvent;
