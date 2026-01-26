import mongoose from 'mongoose';

const loginHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    distanceFromHQ: {
        type: Number, // in km
        required: false
    }
}, {
    timestamps: true
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export default LoginHistory;
