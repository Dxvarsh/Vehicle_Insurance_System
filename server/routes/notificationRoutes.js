import express from 'express';
import {
    getAllNotifications,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    sendCustomNotification,
    deleteNotification,
    getUnreadCount
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// ── Customer Routes ──
router.get('/my', authorize('Customer'), getMyNotifications);
router.get('/unread-count', authorize('Customer'), getUnreadCount);
router.put('/read-all', authorize('Customer'), markAllAsRead);
router.put('/:id/read', authorize('Customer'), markAsRead);

// ── Admin/Staff Routes ──
router.get('/', authorize('Admin', 'Staff'), getAllNotifications);
router.post('/send', authorize('Admin'), sendCustomNotification);

// ── Shared Routes ──
router.delete('/:id', authorize('Customer', 'Admin'), deleteNotification);

export default router;
