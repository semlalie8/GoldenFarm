import express from 'express';
import {
    getLeads, createLead, updateLead, deleteLead,
    getOrders, updateOrderStatus, updateOrderToPaid,
    getTickets, replyToTicket,
    getCRMKPIs
} from '../controllers/crmController.js';
import {
    createMessage,
    getMessages,
    replyToMessage,
    updateMessageStatus
} from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRM Analytics
router.get('/kpis', protect, admin, getCRMKPIs);

// Leads
router.route('/leads')
    .get(protect, admin, getLeads)
    .post(protect, admin, createLead);
router.route('/leads/:id')
    .put(protect, admin, updateLead)
    .delete(protect, admin, deleteLead);

// Orders
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.put('/orders/:id/pay', protect, admin, updateOrderToPaid);

// Tickets
router.get('/tickets', protect, admin, getTickets);
router.post('/tickets/:id/reply', protect, replyToTicket); // Protect only, as users might reply to their own tickets

// Public Contact Messages
router.post('/messages', createMessage); // Public endpoint

// Admin Message Management
router.get('/messages', protect, admin, getMessages);
router.put('/messages/:id/reply', protect, admin, replyToMessage);
router.put('/messages/:id/status', protect, admin, updateMessageStatus);

export default router;
