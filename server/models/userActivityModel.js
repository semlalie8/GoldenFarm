import mongoose from 'mongoose';

const userActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['view_article', 'download_book', 'watch_video', 'view_project', 'purchase_product', 'login', 'update_profile']
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: 'itemModel'
    },
    itemModel: {
        type: String,
        required: false,
        enum: ['Article', 'Book', 'Video', 'Project', 'Product']
    },
    details: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
