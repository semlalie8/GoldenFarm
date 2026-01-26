import express from 'express';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import Message from '../models/contactMessageModel.js';

const router = express.Router();

/**
 * @desc    Send contact form message (Save to DB + Email)
 * @route   POST /api/contact
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
    console.log('Contact route hit. Body:', req.body);
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('All fields are required');
    }

    // 1. Save to Database (Inbox)
    try {
        await Message.create({
            name,
            email,
            subject,
            message,
            status: 'new'
        });
        console.log('Message saved to DB');
    } catch (dbError) {
        console.error('Database save error:', dbError);
        res.status(500);
        throw new Error('Failed to save message to inbox.');
    }

    // 2. Send Email Notification
    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Email to admin/business
    const mailOptions = {
        from: `"GoldenFarm Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[GoldenFarm Contact] ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1a5c2d, #7DC242); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Contact Message</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <p><strong>From:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #ddd; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
                <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                    <p>GoldenFarm Platform - Contact Form Submission</p>
                </div>
            </div>
        `
    };

    try {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } else {
            console.log('Skipping email send: SMTP credentials not set.');
        }
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        // DB save succeeded, so return success to user
        res.status(200).json({ message: 'Message saved to inbox.' });
    }
}));

export default router;
