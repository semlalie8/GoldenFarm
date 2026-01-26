import mongoose from 'mongoose';

const leaveRequestSchema = mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: {
        type: String,
        enum: ['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Special'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachments: [String] // Links to medical certificates, etc.
}, {
    timestamps: true
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
