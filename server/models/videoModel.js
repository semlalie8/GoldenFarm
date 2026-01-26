import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
    title: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    description: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: String },
    category: { type: String },
    isFree: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;
