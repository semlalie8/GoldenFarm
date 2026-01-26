import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
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
    author: { type: String },
    coverImage: { type: String },
    downloadUrl: { type: String },
    price: { type: Number, default: 0 }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
