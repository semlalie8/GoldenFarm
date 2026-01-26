import asyncHandler from 'express-async-handler';
import Video from '../models/videoModel.js';
import Article from '../models/articleModel.js';
import Book from '../models/bookModel.js';
import Service from '../models/serviceModel.js';

// Generic fetcher
const getAll = (Model) => asyncHandler(async (req, res) => {
    const items = await Model.find({}).sort({ createdAt: -1 });
    res.json(items);
});

const getOne = (Model) => asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (item) res.json(item);
    else {
        res.status(404);
        throw new Error('Item not found');
    }
});

const createOne = (Model) => asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
});

const updateOne = (Model) => asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (item) res.json(item);
    else {
        res.status(404);
        throw new Error('Item not found');
    }
});

const deleteOne = (Model) => asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (item) res.json({ message: 'Item removed' });
    else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// Videos
export const getVideos = getAll(Video);
export const getVideoById = getOne(Video);
export const createVideo = createOne(Video);
export const updateVideo = updateOne(Video);
export const deleteVideo = deleteOne(Video);

// Articles
export const getArticles = getAll(Article);
export const getArticleById = getOne(Article);
export const createArticle = createOne(Article);
export const updateArticle = updateOne(Article);
export const deleteArticle = deleteOne(Article);

// Books
export const getBooks = getAll(Book);
export const getBookById = getOne(Book);
export const createBook = createOne(Book);
export const updateBook = updateOne(Book);
export const deleteBook = deleteOne(Book);

// Services
export const getServices = getAll(Service);
export const getServiceById = getOne(Service);
export const createService = createOne(Service);
export const updateService = updateOne(Service);
export const deleteService = deleteOne(Service);
