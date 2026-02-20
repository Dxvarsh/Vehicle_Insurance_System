import express from 'express';
import {
    getAdminStats,
    getChartData,
    getReportsData
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Staff'));

router.get('/stats', getAdminStats);
router.get('/charts', getChartData);
router.get('/reports', authorize('Admin'), getReportsData);

export default router;
