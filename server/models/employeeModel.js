import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true, unique: true },

    // Identity
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,

    // Moroccan Compliance
    cin: { type: String, required: true, unique: true },
    cnssNumber: String,
    cimrNumber: String,
    rib: String, // Bank Account

    // Contract Details
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    contractType: {
        type: String,
        enum: ['CDI', 'CDD', 'ANAPEC', 'Contractor'],
        default: 'CDI'
    },
    hireDate: { type: Date, required: true },
    terminationDate: Date,
    status: {
        type: String,
        enum: ['Active', 'On Leave', 'Suspended', 'Terminated'],
        default: 'Active'
    },

    // Salary Structure (Monthly Base in MAD)
    baseSalary: { type: Number, required: true },
    allowances: [{
        label: String,
        amount: Number,
        isTaxable: { type: Boolean, default: true }
    }],

    // Leave Balances
    annualLeaveBalance: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
