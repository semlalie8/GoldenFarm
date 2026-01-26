import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import eventBus from '../utils/eventBus.js';
import sendEmail from '../utils/sendEmail.js';
import { emitEvent } from '../utils/socket.js';

/**
 * Handle user deposit logic
 */
export const depositFunds = async (userId, amount, paymentMethod, description) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const transaction = await Transaction.create({
        user: userId,
        type: 'deposit',
        amount,
        description: description || 'Account deposit',
        paymentMethod,
        status: 'completed' // Automated approval for demo
    });

    user.walletBalance += Number(amount);
    await user.save();

    eventBus.emit('transaction.completed', {
        transactionId: transaction._id,
        type: 'deposit',
        amount,
        userId
    });

    // Emit real-time event
    emitEvent('NEW_DEPOSIT', {
        userName: user.name,
        amount
    });

    return transaction;
};

/**
 * Handle project investment logic
 */
export const investInProject = async (userId, projectId, amount) => {
    const user = await User.findById(userId);
    const project = await Project.findById(projectId);

    if (!project) throw new Error('Project not found');
    if (user.walletBalance < amount) throw new Error('Insufficient funds');

    // Atomic-like update
    user.walletBalance -= Number(amount);
    project.raisedAmount += Number(amount);

    await Promise.all([user.save(), project.save()]);

    const transaction = await Transaction.create({
        user: userId,
        type: 'investment',
        amount,
        description: `Investment in ${project.title}`,
        referenceId: projectId,
        status: 'completed'
    });

    eventBus.emit('transaction.completed', {
        transactionId: transaction._id,
        type: 'investment',
        amount,
        userId,
        projectId
    });

    // Emit real-time event
    emitEvent('NEW_INVESTMENT', {
        userName: user.name,
        projectTitle: project.title,
        amount,
        progress: ((project.raisedAmount / project.targetAmount) * 100).toFixed(1)
    });

    // Send admin notification email for new investment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goldenfarm.ma';
    const progressPercent = ((project.raisedAmount / project.targetAmount) * 100).toFixed(1);

    await sendEmail({
        email: adminEmail,
        subject: `💰 New Investment: ${amount} MAD in "${project.title}"`,
        message: `A new investment has been made on Golden Farm!

Investment Details:
-------------------
Investor: ${user.name} (${user.email})
Project: ${project.title}
Amount: ${amount} MAD

Project Funding Progress:
Raised: ${project.raisedAmount.toLocaleString()} MAD / ${project.targetAmount.toLocaleString()} MAD
Progress: ${progressPercent}%

Transaction ID: ${transaction._id}

Log in to your admin dashboard for more details.
`
    });

    return transaction;
};
