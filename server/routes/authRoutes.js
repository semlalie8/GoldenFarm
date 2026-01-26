import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    googleAuth,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';

import { authLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.post('/google', authLimiter, googleAuth);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resetToken', authLimiter, resetPassword);

export default router;
