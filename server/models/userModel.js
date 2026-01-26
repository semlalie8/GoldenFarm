import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: function () { return !this.googleId; } // Password not required if using Google Auth
    },
    googleId: {
        type: String,
        required: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'farmer', 'investor', 'accountant', 'manager', 'admin', 'superadmin'],
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'fr', 'ar']
    },
    city: {
        type: String,
        required: false
    },
    profession: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        maxLength: 500
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending'
    },
    isTwoFactorEnabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
