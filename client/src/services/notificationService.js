import api from './api';

const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getMyNotifications: (params) => api.get('/notifications/my', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  sendCustomNotification: (data) => api.post('/notifications/send', data),
};

export default notificationService;
