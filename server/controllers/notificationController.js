import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all notifications (Admin/Staff)
 * @route   GET /api/notifications
 * @access  Admin, Staff
 */
export const getAllNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, messageType, isRead, customerID } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const filter = {};
        if (messageType) filter.messageType = messageType;
        if (isRead !== undefined) filter.isRead = isRead === 'true';
        if (customerID) filter.customerID = customerID;

        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .populate('customerID', 'name email customerID')
                .populate('policyID', 'policyName policyID')
                .sort({ sentDate: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),
            Notification.countDocuments(filter)
        ]);

        return paginatedResponse(res, notifications, pageNum, limitNum, total);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get my notifications (Customer)
 * @route   GET /api/notifications/my
 * @access  Customer
 */
export const getMyNotifications = async (req, res, next) => {
    try {
        if (!req.user.linkedCustomerID) {
            return errorResponse(res, 400, 'No linked customer profile');
        }

        const { page = 1, limit = 10, unreadOnly } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const filter = { customerID: req.user.linkedCustomerID };
        if (unreadOnly === 'true') filter.isRead = false;

        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .populate('policyID', 'policyName policyID')
                .sort({ sentDate: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum)
                .lean(),
            Notification.countDocuments(filter)
        ]);

        const unreadCount = await Notification.countDocuments({
            customerID: req.user.linkedCustomerID,
            isRead: false
        });

        return paginatedResponse(res, notifications, pageNum, limitNum, total, { unreadCount });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Customer
 */
export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            customerID: req.user.linkedCustomerID
        });

        if (!notification) {
            return errorResponse(res, 404, 'Notification not found');
        }

        notification.isRead = true;
        await notification.save();

        return successResponse(res, 200, 'Notification marked as read');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark all my notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Customer
 */
export const markAllAsRead = async (req, res, next) => {
    try {
        if (!req.user.linkedCustomerID) {
            return errorResponse(res, 400, 'No linked customer profile');
        }

        await Notification.updateMany(
            { customerID: req.user.linkedCustomerID, isRead: false },
            { $set: { isRead: true } }
        );

        return successResponse(res, 200, 'All notifications marked as read');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Send a custom notification (Admin)
 * @route   POST /api/notifications/send
 * @access  Admin
 */
export const sendCustomNotification = async (req, res, next) => {
    try {
        const { customerID, title, message, messageType = 'General' } = req.body;

        const notification = await Notification.create({
            customerID,
            title,
            message,
            messageType,
            deliveryStatus: 'Sent'
        });

        return successResponse(res, 201, 'Notification sent successfully', { notification });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Customer, Admin
 */
export const deleteNotification = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user.role === 'Customer') {
            filter.customerID = req.user.linkedCustomerID;
        }

        const notification = await Notification.findOneAndDelete(filter);

        if (!notification) {
            return errorResponse(res, 404, 'Notification not found');
        }

        return successResponse(res, 200, 'Notification deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get unread count
 * @route   GET /api/notifications/unread-count
 * @access  Customer
 */
export const getUnreadCount = async (req, res, next) => {
    try {
        if (!req.user.linkedCustomerID) {
            return successResponse(res, 200, 'Unread count', { unreadCount: 0 });
        }

        const unreadCount = await Notification.countDocuments({
            customerID: req.user.linkedCustomerID,
            isRead: false
        });

        return successResponse(res, 200, 'Unread count fetched', { unreadCount });
    } catch (error) {
        next(error);
    }
};
