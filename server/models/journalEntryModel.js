import mongoose from 'mongoose';

const journalEntrySchema = mongoose.Schema({
    transactionDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    reference: {
        type: String, // Invoice #, Order #, Campaign ID
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['draft', 'posted', 'reversed'],
        default: 'draft'
    },
    lines: [{
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LedgerAccount',
            required: true
        },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        memo: String
    }],
    // Hyper-Connectivity with CRM
    crmContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    crmDeal: {
        type: mongoose.Schema.Types.ObjectId, // Link to Lead/Deal
        ref: 'Lead'
    },
    relatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Middleware to ensure debits == credits before posting
journalEntrySchema.pre('save', function (next) {
    if (this.status === 'posted') {
        const totalDebit = this.lines.reduce((sum, line) => sum + line.debit, 0);
        const totalCredit = this.lines.reduce((sum, line) => sum + line.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return next(new Error('Journal Entry is unbalanced: Debits must equal Credits'));
        }
    }
    next();
});

const JournalEntry = mongoose.models.JournalEntry || mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
