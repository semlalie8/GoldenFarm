import asyncHandler from 'express-async-handler';
import Lead from '../models/leadModel.js';
import Order from '../models/orderModel.js';
import Ticket from '../models/ticketModel.js';
import Enrollment from '../models/enrollmentModel.js';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import Transaction from '../models/transactionModel.js';
import { triggerAutomation } from '../utils/automation.js';

// --- LEAD MANAGEMENT ---

export const getLeads = asyncHandler(async (req, res) => {
    const leads = await Lead.find({}).populate('assignedTo', 'name email').sort('-createdAt');
    res.json(leads);
});

export const createLead = asyncHandler(async (req, res) => {
    const lead = new Lead(req.body);
    const createdLead = await lead.save();

    // Trigger Automation Flow
    await triggerAutomation('NEW_LEAD', createdLead);

    res.status(201).json(createdLead);
});

export const updateLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
        Object.assign(lead, req.body);
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404);
        throw new Error('Lead not found');
    }
});

export const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } else {
        res.status(404);
        throw new Error('Lead not found');
    }
});

// --- ORDER MANAGEMENT ---

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === 'delivered';
        if (order.isDelivered) order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: 'admin_marked',
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: req.user.email
        };
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// --- SUPPORT TICKETS ---

export const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({}).populate('user', 'name email').populate('assignedTo', 'name').sort('-createdAt');
    res.json(tickets);
});

export const replyToTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (ticket) {
        const message = {
            sender: req.user._id,
            message: req.body.message,
            senderRole: req.user.role,
            createdAt: new Date()
        };
        ticket.messages.push(message);
        if (req.body.status) ticket.status = req.body.status;
        const updatedTicket = await ticket.save();

        // Trigger Automation Flow
        await triggerAutomation('TICKET_REPLY', { ticket: updatedTicket, lastMessage: message });

        res.json(updatedTicket);
    } else {
        res.status(404);
        throw new Error('Ticket not found');
    }
});

// --- PLATFORM ANALYTICS (CRM DASHBOARD) ---

export const getCRMKPIs = asyncHandler(async (req, res) => {
    const totalInvestors = await User.countDocuments({ role: 'user' }); // Simplified
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const liveProjects = await Project.countDocuments({ status: 'live' });
    const totalVolume = await Transaction.aggregate([
        { $match: { type: 'investment', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const salesMetrics = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$estimatedValue' } } }
    ]);

    res.json({
        platformStats: {
            totalInvestors,
            totalFarmers,
            liveProjects,
            totalInvested: totalVolume[0]?.total || 0
        },
        salesMetrics
    });
});
