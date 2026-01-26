import mongoose from 'mongoose';

const translationSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ['en', 'fr', 'ar', 'zgh'],
    },
    namespace: {
        type: String,
        default: 'translation',
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

// Ensure unique key per language and namespace
translationSchema.index({ language: 1, namespace: 1, key: 1 }, { unique: true });

const Translation = mongoose.model('Translation', translationSchema);

export default Translation;
