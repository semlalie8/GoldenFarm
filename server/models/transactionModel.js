import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'investment', 'payout', 'refund', 'commission'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending',
    },
    description: {
        type: String,
    },
    referenceId: { // e.g., Project ID or External Payment ID
        type: String,
    },
    paymentMethod: {
        type: String, // e.g., 'paypal', 'stripe', 'bank_transfer'
    }
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
