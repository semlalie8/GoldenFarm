import mongoose from 'mongoose';

const payrollRunSchema = new mongoose.Schema({
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'approved', 'paid'], default: 'draft' },
    totalPayout: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 }, // IR
    totalSocialSecurity: { type: Number, default: 0 }, // CNSS
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const payslipSchema = new mongoose.Schema({
    payrollRun: { type: mongoose.Schema.Types.ObjectId, ref: 'PayrollRun', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Earnings
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },

    // Deductions
    taxIR: { type: Number, default: 0 }, // Impôt sur le Revenu
    cnss: { type: Number, default: 0 }, // Caisse Nationale de Sécurité Sociale
    amo: { type: Number, default: 0 }, // Assurance Maladie Obligatoire
    advances: { type: Number, default: 0 },

    netPay: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

export const PayrollRun = mongoose.model('PayrollRun', payrollRunSchema);
export const Payslip = mongoose.model('Payslip', payslipSchema);
