import Project from '../models/projectModel.js';
import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';

/**
 * Automates payouts for completed projects.
 * This can be run as a cron job or triggered manually.
 */
export const processAutomatedPayouts = async () => {
    console.log('--- Starting Automated Payout Process ---');

    try {
        // Find projects that are 'completed' but might still have funds to distribute
        const completedProjects = await Project.find({ status: 'completed' });

        for (const project of completedProjects) {
            // Logic to identify investors and calculate their share of the profit
            // This is a simplified scaffold
            const investments = await Transaction.find({
                referenceId: project._id,
                type: 'investment',
                status: 'completed'
            });

            for (const inv of investments) {
                // Example calculation: Payout = Investment + (Investment * ROI / 100)
                const payoutAmount = inv.amount + (inv.amount * (project.roi || 0) / 100);

                // Check if payout already exists to avoid duplicates
                const existingPayout = await Transaction.findOne({
                    user: inv.user,
                    referenceId: project._id,
                    type: 'payout'
                });

                if (!existingPayout) {
                    // Create Payout Transaction
                    const payout = new Transaction({
                        user: inv.user,
                        type: 'payout',
                        amount: payoutAmount,
                        status: 'completed',
                        description: `Automated payout for project: ${project.title.en}`,
                        referenceId: project._id
                    });

                    await payout.save();

                    // Update User Wallet
                    const user = await User.findById(inv.user);
                    if (user) {
                        user.walletBalance += payoutAmount;
                        await user.save();
                        console.log(`Paid out ${payoutAmount} MAD to user ${user.email} for project ${project._id}`);
                    }
                }
            }
        }

        console.log('--- Automated Payout Process Completed ---');
    } catch (error) {
        console.error('Error in automated payouts:', error);
    }
};
