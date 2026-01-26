import mongoose from 'mongoose';

const reportSchema = mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Institutional', 'Project_Audit', 'Market_Synthesis', 'Proof_Of_Intelligence'],
        default: 'Institutional'
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    contentPath: String, // Path to stored PDF if persisted on server
    dataSnapshot: {
        type: Object, // Frozen JSON state of the data at time of generation
        required: true
    },
    sealHash: {
        type: String, // Cryptographic seal for authenticity
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'certified', 'archived'],
        default: 'certified'
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
