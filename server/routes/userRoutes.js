import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    recordUserActivity,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/activity')
    .post(protect, recordUserActivity);

router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById);

export default router;
