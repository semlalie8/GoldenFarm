import express from 'express';
import {
    getVideos, getVideoById, createVideo, updateVideo, deleteVideo,
    getArticles, getArticleById, createArticle, updateArticle, deleteArticle,
    getBooks, getBookById, createBook, updateBook, deleteBook,
    getServices, getServiceById, createService, updateService, deleteService
} from '../controllers/contentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Videos
router.route('/videos').get(getVideos).post(protect, admin, createVideo);
router.route('/videos/:id').get(getVideoById).put(protect, admin, updateVideo).delete(protect, admin, deleteVideo);

// Articles
router.route('/articles').get(getArticles).post(protect, admin, createArticle);
router.route('/articles/:id').get(getArticleById).put(protect, admin, updateArticle).delete(protect, admin, deleteArticle);

// Books
router.route('/books').get(getBooks).post(protect, admin, createBook);
router.route('/books/:id').get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);

// Services
router.route('/services').get(getServices).post(protect, admin, createService);
router.route('/services/:id').get(getServiceById).put(protect, admin, updateService).delete(protect, admin, deleteService);

export default router;
