import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Null for system events or failed logins
    },
    action: {
        type: String,
        required: true,
        index: true
    },
    module: {
        type: String,
        required: true,
        enum: ['AUTH', 'FINANCE', 'HR', 'INVENTORY', 'IOT', 'SYSTEM'],
        index: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'WARNING'],
        default: 'SUCCESS'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    previousState: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    newState: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false // We use our own timestamp for precision
});

// Optimization: Ensure high-speed retrieval for auditors
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ module: 1, action: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
