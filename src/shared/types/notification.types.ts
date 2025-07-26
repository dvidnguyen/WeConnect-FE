// Notification types
import type { User } from '@/shared/types';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: "message" | "friend_request" | "system";
  related_id?: string; // message_id, friend_id, etc.
  is_read: boolean;
  created_at: string;
  // Populated fields
  user?: User;
  relatedData?: MessageNotificationData | FriendRequestNotificationData | Record<string, unknown>; // Depends on type
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  loadNotifications: () => Promise<void>;
}

export type NotificationType = "message" | "friend_request" | "system";

// Specific notification payloads
export interface MessageNotificationData {
  conversationId: string;
  messageId: string;
  senderName: string;
}

export interface FriendRequestNotificationData {
  friendRequestId: string;
  requesterName: string;
  requesterAvatar: string;
}
