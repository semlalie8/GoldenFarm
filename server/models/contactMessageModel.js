import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['general', 'sales', 'support', 'investment', 'technical'],
        default: 'general'
    },
    replies: [{
        replyText: String,
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Explicitly use a new model name and collection
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', messageSchema, 'messages');

export default ContactMessage;
