import express from 'express';
import { chatWithAgent } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Make chat public so visitors can use it (Baidar). 
// User-specific data will be injected in controller if userInfo is present.
router.post('/chat', chatWithAgent);

export default router;
