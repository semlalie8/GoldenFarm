import mongoose from 'mongoose';

const articleSchema = mongoose.Schema({
    title: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    content: {
        en: { type: String, required: true },
        fr: { type: String },
        ar: { type: String }
    },
    author: { type: String },
    image: { type: String },
    category: { type: String },
    tags: [{ type: String }]
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
export default Article;
