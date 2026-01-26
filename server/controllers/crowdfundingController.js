import asyncHandler from 'express-async-handler';
import Campaign from '../models/Campaign.js';
import Project from '../models/projectModel.js';
import Transaction from '../models/transactionModel.js';
import mongoose from 'mongoose';

/**
 * @desc    Pledge to a Campaign (Backer Flow)
 * @route   POST /api/crowdfunding/pledge
 * @access  Private
 */
export const pledgeToCampaign = asyncHandler(async (req, res) => {
    const { campaignId, amount, paymentMethod } = req.body;

    try {
        let targetAsset = await Campaign.findById(campaignId);
        let isProject = false;

        if (!targetAsset) {
            targetAsset = await Project.findById(campaignId);
            isProject = true;
        }

        if (!targetAsset) {
            res.status(404);
            throw new Error('Investment target not found');
        }

        const status = isProject ? targetAsset.status : targetAsset.status;
        const normalizedStatus = status ? status.toUpperCase() : '';

        if (normalizedStatus !== 'ACTIVE') {
            throw new Error('Investment target is not currently active');
        }

        // Automated Compliance Check
        const { default: financeService } = await import('../services/financeService.js');
        const complianceStatus = await financeService.verifyInvestmentCompliance(
            req.user._id,
            amount,
            targetAsset.category || "agriculture"
        );

        if (complianceStatus.status !== 'PASSED') {
            throw new Error(`COMPLIANCE_REJECTION: ${complianceStatus.notes}`);
        }

        // Create the financial record
        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'investment',
            amount,
            status: 'completed',
            description: `Pledge to ${isProject ? (targetAsset.title?.en || targetAsset.title) : targetAsset.title}`,
            referenceId: targetAsset._id,
            paymentMethod
        });

        // Update Asset Funding
        if (isProject) {
            targetAsset.raisedAmount += Number(amount);
            targetAsset.backerCount += 1;
        } else {
            targetAsset.currentFunding += Number(amount);
            targetAsset.backerCount += 1;
        }

        await targetAsset.save();

        // Real-time Event Emission for Dashboard & CRM
        const { emitEvent } = await import('../utils/socket.js');
        emitEvent('funding.update', {
            assetId: targetAsset._id,
            newFundingTotal: isProject ? targetAsset.raisedAmount : targetAsset.currentFunding,
            backerCount: targetAsset.backerCount,
            type: isProject ? 'project' : 'campaign',
            investor: req.user.name,
            amount
        });

        res.status(201).json({
            message: 'Pledge Successful',
            transaction,
            newFundingTotal: isProject ? targetAsset.raisedAmount : targetAsset.currentFunding
        });

    } catch (error) {
        console.error('[Pledge] Error:', error.message);
        res.status(400);
        throw new Error(error.message);
    }
});
