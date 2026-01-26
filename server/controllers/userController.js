import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import * as userService from '../services/userService.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            profession: user.profession,
            role: user.role,
            avatar: user.avatar,
            language: user.language,
            walletBalance: user.walletBalance
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.city = req.body.city || user.city;
        user.profession = req.body.profession || user.profession;
        user.avatar = req.body.avatar || user.avatar;
        user.language = req.body.language || user.language;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            city: updatedUser.city,
            profession: updatedUser.profession,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            language: updatedUser.language,
            walletBalance: updatedUser.walletBalance
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users with login stats (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Audit Logging for Sensitive Data Access
    const { default: SecurityAudit } = await import('../models/securityAuditModel.js');
    await SecurityAudit.create({
        event: 'SENSITIVE_DATA_ACCESS',
        severity: 'LOW',
        userId: req.user._id,
        ipAddress: req.ip,
        path: req.originalUrl,
        method: req.method,
        details: { action: 'FETCH_ALL_USERS', result_count: 'ALL' }
    });

    const usersWithStats = await userService.getAllUsersWithStats();
    res.json(usersWithStats);
});

// @desc    Get user by ID with full details (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    try {
        const userDetails = await userService.getUserDetailedProfile(req.params.id);
        res.json(userDetails);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
});

// @desc    Record user activity
// @route   POST /api/users/activity
// @access  Private
const recordUserActivity = asyncHandler(async (req, res) => {
    const { type, item, itemModel, details } = req.body;
    const activity = await userService.trackActivity(
        req.user._id,
        type,
        item,
        itemModel,
        details
    );
    res.status(201).json(activity);
});

export {
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    recordUserActivity,
};
