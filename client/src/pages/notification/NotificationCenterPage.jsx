import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotificationStatus
} from '../../store/slices/notificationSlice';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import {
    Bell,
    CheckCircle2,
    Trash2,
    Clock,
    MailOpen,
    Shield,
    AlertTriangle,
    HandCoins,
    MoreVertical
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

const NotificationCenterPage = () => {
    const dispatch = useDispatch();
    const {
        myNotifications: notifications,
        loading,
        unreadCount,
        error,
        success
    } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(fetchMyNotifications({ page: 1, limit: 20 }));
        return () => dispatch(clearNotificationStatus());
    }, [dispatch]);

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
    };

    const handleMarkRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleDelete = (id) => {
        dispatch(deleteNotification(id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Expiry': return <AlertTriangle className="w-5 h-5 text-warning" />;
            case 'Renewal': return <Shield className="w-5 h-5 text-primary-500" />;
            case 'Claim-Update': return <HandCoins className="w-5 h-5 text-success" />;
            case 'Payment': return <CheckCircle2 className="w-5 h-5 text-success" />;
            default: return <Bell className="w-5 h-5 text-gray-400" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'Expiry': return 'bg-warning-light';
            case 'Renewal': return 'bg-primary-50';
            case 'Claim-Update': return 'bg-success-light';
            case 'Payment': return 'bg-success-light';
            default: return 'bg-gray-100';
        }
    };

    if (loading && notifications.length === 0) {
        return <Loader fullScreen text="Opening your inbox..." />;
    }

    return (
        <div>
            <PageHeader
                title="Notification Center"
                subtitle={`You have ${unreadCount} unread messages`}
            >
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                        <MailOpen className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </PageHeader>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => dispatch(clearNotificationStatus())}
                    className="mb-6"
                />
            )}
            {success && (
                <Alert
                    type="success"
                    message={success}
                    onClose={() => dispatch(clearNotificationStatus())}
                    className="mb-6"
                />
            )}

            {notifications.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="All caught up!"
                    description="You don't have any notifications at the moment."
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={cn(
                                "relative group bg-white rounded-2xl border transition-all duration-200 p-5 flex gap-4",
                                notification.isRead
                                    ? "border-gray-100 opacity-75"
                                    : "border-primary-100 shadow-sm shadow-primary-50 border-l-4 border-l-primary-500"
                            )}
                        >
                            {/* Icon */}
                            <div className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                                getBgColor(notification.messageType)
                            )}>
                                {getIcon(notification.messageType)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className={cn(
                                        "text-sm sm:text-base font-bold truncate",
                                        notification.isRead ? "text-gray-600" : "text-gray-900"
                                    )}>
                                        {notification.title}
                                    </h4>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkRead(notification._id)}
                                                className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <MailOpen className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification._id)}
                                            className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className={cn(
                                    "text-sm mt-1",
                                    notification.isRead ? "text-gray-500" : "text-gray-700"
                                )}>
                                    {notification.message}
                                </p>
                                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 font-medium tracking-tight">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDate(notification.sentDate)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full uppercase text-[10px] font-bold">
                                        {notification.messageType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationCenterPage;
