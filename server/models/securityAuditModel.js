import mongoose from 'mongoose';

const securityAuditSchema = mongoose.Schema({
    event: {
        type: String,
        required: true,
        enum: ['UNAUTHORIZED_ACCESS', 'BRUTE_FORCE_ATTEMPT', 'XSS_DETECTED', 'RATE_LIMIT_EXCEEDED', 'SENSITIVE_DATA_ACCESS']
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
    },
    ipAddress: String,
    userAgent: String,
    path: String,
    method: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    details: Object,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const SecurityAudit = mongoose.model('SecurityAudit', securityAuditSchema);

export default SecurityAudit;
