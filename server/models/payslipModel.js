import mongoose from 'mongoose';

const payslipSchema = mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    payrollRun: { type: mongoose.Schema.Types.ObjectId, ref: 'PayrollRun', required: true },

    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },

    // Earnings
    baseSalary: { type: Number, required: true },
    overtimePay: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    allowances: [{ label: String, amount: Number }],
    grossSalary: { type: Number, required: true },

    // Deductions (Moroccan Standard)
    cnss: { type: Number, default: 0 }, // 4.48% (capped)
    amo: { type: Number, default: 0 },  // 2.26%
    ir: { type: Number, default: 0 },   // Income Tax (Progressive)
    otherDeductions: { type: Number, default: 0 },

    netSalary: { type: Number, required: true },

    // Employer Costs (For Finance Hub reporting)
    employerCnss: { type: Number, default: 0 },
    employerAmo: { type: Number, default: 0 },
    totalEmployerCost: { type: Number, default: 0 },

    status: { type: String, enum: ['Draft', 'Sent', 'Paid'], default: 'Draft' },
    paymentDate: Date,
    paymentReference: String
}, {
    timestamps: true
});

const Payslip = mongoose.model('Payslip', payslipSchema);
export default Payslip;
