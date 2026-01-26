import express from 'express';
import {
    getEmployees,
    createEmployee,
    runPayroll,
    getHRStats
} from '../controllers/hrController.js';
import authorize, { ROLES } from '../middleware/rbacMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/employees', protect, authorize(ROLES.MANAGEMENT), getEmployees);
router.post('/employees', protect, authorize(ROLES.MANAGEMENT), createEmployee);

router.post('/payroll/run', protect, authorize(ROLES.MANAGEMENT), runPayroll);
router.get('/stats', protect, authorize(ROLES.MANAGEMENT), getHRStats);

export default router;
