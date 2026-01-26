import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    approveProject,
    getProjectAnalysis,
    getProjectInstitutionalAudit
} from '../controllers/projectController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(optionalProtect, getProjects)
    .post(protect, createProject);

router.route('/:id')
    .get(getProjectById)
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

router.route('/:id/approve')
    .put(protect, admin, approveProject);

router.route('/:id/analysis')
    .get(optionalProtect, getProjectAnalysis);

router.route('/:id/audit')
    .get(protect, getProjectInstitutionalAudit);

export default router;
