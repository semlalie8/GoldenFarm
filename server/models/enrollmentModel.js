import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    courseType: {
        type: String,
        enum: ['video', 'book', 'article'],
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Since we have multiple content types, we track the ID and use the courseType to populate
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    quizScores: [{
        quizId: String,
        score: Number,
        maxScore: Number,
        date: { type: Date, default: Date.now }
    }],
    certificateIssued: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
