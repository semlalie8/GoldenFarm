import mongoose from 'mongoose';

const ledgerAccountSchema = mongoose.Schema({
    accountCode: {
        type: String,
        required: true,
        unique: true // e.g., '1001', '2001'
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'MAD'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: String
}, {
    timestamps: true
});

const LedgerAccount = mongoose.models.LedgerAccount || mongoose.model('LedgerAccount', ledgerAccountSchema);

export default LedgerAccount;
