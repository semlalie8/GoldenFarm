import mongoose from 'mongoose';

const marketingSegmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,

    // Logic for dynamic inclusion
    filters: [{
        field: String, // e.g., 'totalInvested', 'lastLogin', 'userRole'
        operator: {
            type: String,
            enum: ['equals', 'not_equals', 'gt', 'lt', 'contains', 'matches_regex']
        },
        value: mongoose.Schema.Types.Mixed
    }],

    isStatic: { type: Boolean, default: false }, // if true, users are manually added
    manualUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Stats for UI
    cachedUserCount: { type: Number, default: 0 },
    lastCalculated: Date
}, {
    timestamps: true
});

const MarketingSegment = mongoose.model('MarketingSegment', marketingSegmentSchema);
export default MarketingSegment;
