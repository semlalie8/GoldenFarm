import express from 'express';
import {
    getTranslations,
    updateTranslation,
    getMissingTranslations,
} from '../controllers/translationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:lang/:ns', getTranslations);
router.post('/', protect, admin, updateTranslation);
router.get('/missing', protect, admin, getMissingTranslations);

export default router;
