// Mock data for notifications
import type { Notification, MessageNotificationData, FriendRequestNotificationData } from '@/shared/types';
import { mockUsers } from './messages.mock';

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Tin nhắn mới",
    body: "Bạn có tin nhắn mới từ Nguyễn Hoàng Nam",
    type: "message",
    related_id: "conv-1",
    is_read: false,
    created_at: "2025-07-25T11:35:00Z",
    user: mockUsers[0],
    relatedData: {
      conversationId: "conv-1",
      messageId: "msg-1-2",
      senderName: "Nguyễn Hoàng Nam"
    } as MessageNotificationData
  },
  {
    id: "notif-2",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Lời mời kết bạn",
    body: "Phạm Thu Mai đã gửi lời mời kết bạn",
    type: "friend_request",
    related_id: "friend-3",
    is_read: false,
    created_at: "2025-07-25T09:05:00Z",
    user: mockUsers[0],
    relatedData: {
      friendRequestId: "friend-3",
      requesterName: "Phạm Thu Mai",
      requesterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai"
    } as FriendRequestNotificationData
  },
  {
    id: "notif-3",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Tin nhắn nhóm",
    body: "Tin nhắn mới trong Nhóm Dự Án",
    type: "message",
    related_id: "conv-group-1",
    is_read: true,
    created_at: "2025-07-25T11:30:00Z",
    user: mockUsers[0],
    relatedData: {
      conversationId: "conv-group-1",
      messageId: "msg-g1-1",
      senderName: "Nguyễn Hoàng Nam"
    } as MessageNotificationData
  },
  {
    id: "notif-4",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Cập nhật hệ thống",
    body: "WeConnect đã được cập nhật phiên bản mới",
    type: "system",
    related_id: undefined,
    is_read: true,
    created_at: "2025-07-24T08:00:00Z",
    user: mockUsers[0],
    relatedData: {
      version: "1.2.0",
      features: ["Group chat improvements", "Better notifications"]
    }
  }
];

// Helper functions
export const getNotificationsByUserId = (userId: string) =>
  mockNotifications.filter(notif => notif.user_id === userId);

export const getUnreadNotifications = (userId: string) =>
  mockNotifications.filter(notif => notif.user_id === userId && !notif.is_read);

export const getUnreadCount = (userId: string): number =>
  getUnreadNotifications(userId).length;

export const markNotificationAsRead = (notificationId: string) => {
  const notification = mockNotifications.find(notif => notif.id === notificationId);
  if (notification) {
    notification.is_read = true;
  }
};

export const markAllNotificationsAsRead = (userId: string) => {
  mockNotifications
    .filter(notif => notif.user_id === userId)
    .forEach(notif => notif.is_read = true);
};
