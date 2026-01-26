import asyncHandler from 'express-async-handler';

/**
 * RBAC Middleware Factory
 * Restricts access to routes based on a list of authorized roles.
 * @param {Array<string>} authorizedRoles - The roles permitted to access the resource.
 */
const authorize = (authorizedRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user data missing from request context.');
        }

        const userRole = req.user.role;

        // Superadmins always bypass RBAC checks
        if (userRole === 'superadmin') {
            return next();
        }

        if (!authorizedRoles.includes(userRole)) {
            res.status(403); // Forbidden
            throw new Error(`Access Denied: Your role [${userRole}] does not have the required permissions for this resource.`);
        }

        next();
    });
};

// Preddefined Enterprise Access Groups
export const ROLES = {
    ADMIN_ONLY: ['admin'],
    ACCOUNTING: ['admin', 'accountant'],
    MANAGEMENT: ['admin', 'manager'],
    INVESTORS: ['admin', 'investor'],
    OPERATIONS: ['admin', 'manager', 'accountant', 'farmer'],
};

export default authorize;
