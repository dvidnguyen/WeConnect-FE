import api from './axios';
import type { Notification } from '@/shared/types';

export const notificationApi = {
  // Get notifications
  getNotifications: (page = 1, limit = 20) =>
    api.get<{
      notifications: Notification[];
      unreadCount: number;
      hasMore: boolean;
    }>(`/api/notifications?page=${page}&limit=${limit}`),

  // Mark as read
  markAsRead: (notificationId: string) =>
    api.put(`/api/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    api.put('/api/notifications/read-all'),

  // Delete notification
  deleteNotification: (notificationId: string) =>
    api.delete(`/api/notifications/${notificationId}`),

  // Get unread count
  getUnreadCount: () =>
    api.get<{ count: number }>('/api/notifications/unread-count'),
};
