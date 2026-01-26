import AuditLog from '../models/auditLogModel.js';

/**
 * AuditService - The Forensic Blackbox logic for Golden Farm.
 * Provides singleton utility for recording immutable system actions.
 */
class AuditService {
    /**
     * Record a critical platform action.
     * @param {Object} params
     */
    async log({
        user = null,
        action,
        module,
        status = 'SUCCESS',
        details = {},
        previousState = null,
        newState = null,
        req = null
    }) {
        try {
            const auditData = {
                user: user || (req && req.user ? req.user._id : null),
                action,
                module,
                status,
                details,
                previousState,
                newState,
                timestamp: new Date()
            };

            if (req) {
                auditData.ipAddress = req.ip || req.connection.remoteAddress;
                auditData.userAgent = req.headers['user-agent'];
            }

            const entry = await AuditLog.create(auditData);
            console.log(`[Audit] Action '${action}' recorded in module '${module}' [ID: ${entry._id}]`);
        } catch (error) {
            // We never throw on audit failure to prevent platform shutdown, 
            // but we log heavily in system stdout.
            console.error('[Audit FAILURE] Critical error writing to forensic log:', error.message);
        }
    }
}

export default new AuditService();
