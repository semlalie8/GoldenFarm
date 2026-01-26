import User from '../models/userModel.js';
import LoginHistory from '../models/loginHistoryModel.js';
import Transaction from '../models/transactionModel.js';
import Project from '../models/projectModel.js';
import UserActivity from '../models/userActivityModel.js';
import eventBus from '../utils/eventBus.js';

/**
 * Get aggregated stats for all users (Admin View)
 */
export const getAllUsersWithStats = async () => {
    const users = await User.find({}).select('-password');

    return await Promise.all(users.map(async (user) => {
        const [lastLogin, loginCount, investments] = await Promise.all([
            LoginHistory.findOne({ user: user._id }).sort({ loginTime: -1 }),
            LoginHistory.countDocuments({ user: user._id }),
            Transaction.find({ user: user._id, type: 'investment', status: 'completed' })
        ]);

        const projectIds = [...new Set(investments.map(inv => inv.referenceId))];
        const projectsSupported = await Project.find({ _id: { $in: projectIds } }).select('title image category');

        return {
            ...user.toObject(),
            lastLogin: lastLogin ? {
                time: lastLogin.loginTime,
                city: lastLogin.city,
                country: lastLogin.country,
                ipAddress: lastLogin.ipAddress
            } : null,
            loginCount,
            projectsSupportedCount: projectIds.length,
            projectsSupported,
            productsBoughtCount: 0,
            productsBought: []
        };
    }));
};

/**
 * Get detailed profile for a single user (Admin View)
 */
export const getUserDetailedProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');

    const [loginHistory, transactions, activity] = await Promise.all([
        LoginHistory.find({ user: userId }).sort({ loginTime: -1 }),
        Transaction.find({ user: userId }).lean(),
        UserActivity.find({ user: userId }).populate('item').lean()
    ]);

    const timeline = [
        ...transactions.map(t => ({ ...t, kind: 'transaction' })),
        ...activity.map(a => ({ ...a, kind: 'activity' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
        ...user.toObject(),
        loginHistory,
        transactions,
        timeline
    };
};

/**
 * Record generic user activity
 */
export const trackActivity = async (userId, type, item, itemModel, details) => {
    const activity = await UserActivity.create({
        user: userId,
        type,
        item,
        itemModel,
        details
    });

    eventBus.emit('activity.recorded', {
        userId,
        type,
        item,
        itemModel,
        details
    });

    return activity;
};
