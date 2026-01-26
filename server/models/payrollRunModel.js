import mongoose from 'mongoose';

const payrollRunSchema = mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Payroll January 2026'
    month: { type: Number, required: true },
    year: { type: Number, required: true },

    status: {
        type: String,
        enum: ['Draft', 'Processing', 'Approved', 'Paid', 'Cancelled'],
        default: 'Draft'
    },

    totalGross: { type: Number, default: 0 },
    totalNet: { type: Number, default: 0 },
    totalEmployerTax: { type: Number, default: 0 },

    employeeCount: { type: Number, default: 0 },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,

    journalEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry' }
}, {
    timestamps: true
});

const PayrollRun = mongoose.model('PayrollRun', payrollRunSchema);
export default PayrollRun;
