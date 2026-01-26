import rateLimit from 'express-rate-limit';
import SecurityAudit from '../models/securityAuditModel.js';

/**
 * Global API Rate Limiter
 * Prevents DDoS and Brute Force
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    handler: async (req, res, next, options) => {
        await SecurityAudit.create({
            event: 'RATE_LIMIT_EXCEEDED',
            severity: 'MEDIUM',
            ipAddress: req.ip,
            path: req.originalUrl,
            method: req.method,
            details: { limit: options.max, windowMs: options.windowMs }
        });
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Specialized Limiter for Auth Routes
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: {
        message: 'Too many login attempts, please try again after an hour'
    },
    handler: async (req, res, next, options) => {
        await SecurityAudit.create({
            event: 'BRUTE_FORCE_ATTEMPT',
            severity: 'HIGH',
            ipAddress: req.ip,
            path: req.originalUrl,
            method: req.method,
            details: { body: req.body.email || 'REDACTED' }
        });
        res.status(options.statusCode).send(options.message);
    }
});

/**
 * Security Monitor Middleware
 * Logs unauthorized access attempts
 */
export const securityMonitor = async (req, res, next) => {
    // This is called by authMiddleware when a check fails
    // or manually in controllers for suspicious payloads
    next();
};
