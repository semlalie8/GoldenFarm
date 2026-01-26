import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in cookies (support both 'jwt' and 'access_token')
    token = req.cookies.jwt || req.cookies.access_token;

    // Fallback to Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Support both 'id' and 'userId' fields for backward compatibility
            const userId = decoded.id || decoded.userId;
            req.user = await User.findById(userId).select('-password');
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

const optionalProtect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt || req.cookies.access_token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id || decoded.userId;
            req.user = await User.findById(userId).select('-password');
        } catch (error) {
            // Ignore token errors for optional protection
        }
    }
    next();
});

export { protect, admin, optionalProtect };
