import mongoose from 'mongoose';

const approvalSchema = mongoose.Schema({
    agent: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        required: true,
        enum: ['MESSAGE_SEND', 'TRANSACTION_EXECUTE', 'STATUS_CHANGE', 'OTHER']
    },
    payload: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestedBy: {
        type: String, // 'AI' or Agent Name
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    metadata: Object
}, {
    timestamps: true
});

const Approval = mongoose.model('Approval', approvalSchema);

export default Approval;
