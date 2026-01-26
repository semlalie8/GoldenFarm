import asyncHandler from 'express-async-handler';
import Message from '../models/contactMessageModel.js';
import sendEmail from '../utils/sendEmail.js';
import { triggerAutomation } from '../utils/automation.js';

/**
 * @desc    Submit a new contact message (Public)
 * @route   POST /api/crm/messages
 * @access  Public
 */
export const createMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
        name,
        email,
        subject,
        message
    });

    // Optional: Trigger "New Message" automation (e.g. email to admin)
    // await triggerAutomation('NEW_CONTACT_MESSAGE', newMessage);

    res.status(201).json(newMessage);
});

/**
 * @desc    Get all messages
 * @route   GET /api/crm/messages
 * @access  Private/Admin
 */
export const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({}).sort('-createdAt');
    res.json(messages);
});

/**
 * @desc    Update message status (Mark as read/archived)
 * @route   PUT /api/crm/messages/:id/status
 * @access  Private/Admin
 */
export const updateMessageStatus = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (message) {
        message.status = req.body.status || message.status;
        const updatedMessage = await message.save();
        res.json(updatedMessage);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

/**
 * @desc    Reply to a message
 * @route   PUT /api/crm/messages/:id/reply
 * @access  Private/Admin
 */
export const replyToMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (message) {
        const { replyText } = req.body;

        message.replies.push({
            replyText,
            repliedBy: req.user._id
        });
        message.status = 'replied';

        await message.save();

        // Send confirmation email
        await sendEmail({
            email: message.email,
            subject: `Re: ${message.subject} - GoldenFarm Support`,
            message: replyText
        });

        res.json(message);
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});
