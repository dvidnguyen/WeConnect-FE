import { useContext } from 'react';
import { SocketContext } from '@/app/providers/SocketProvider';

// Match với NotificationResponse từ BE
interface NotificationResponse {
  id: string;
  body: string;
  title: string;
  type: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  relatedId?: string;
  createdAt: string;
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return {
    // Connection status
    isConnected: context.isConnected,
    socketId: context.socketId,

    // Friend request operations
    sendFriendRequest: context.sendFriendRequest,
    acceptFriendRequest: context.acceptFriendRequest,
    rejectFriendRequest: context.rejectFriendRequest,

    // Event listeners (match với BE events)
    onFriendRequestReceived: (callback: (data: NotificationResponse) => void) => {
      context.onFriendRequestReceived(callback as (data: unknown) => void);
    },

    onFriendRequestAccepted: (callback: (data: NotificationResponse) => void) => {
      context.onFriendRequestAccepted(callback as (data: unknown) => void);
    },

    onFriendRequestRejected: (callback: (data: NotificationResponse) => void) => {
      context.onFriendRequestRejected(callback as (data: unknown) => void);
    },

    onNotification: (callback: (data: NotificationResponse) => void) => {
      context.onNotification(callback as (data: unknown) => void);
    },

    onConnected: (callback: (message: string) => void) => {
      context.onConnected(callback as (data: unknown) => void);
    },

    onMessageReceived: (callback: (data: unknown) => void) => {
      context.onMessageReceived(callback);
    },

    // Generic methods
    emit: context.emit,
    on: context.on,
    off: context.off,

    // Utility methods
    removeAllListeners: (event: string) => {
      context.off(event);
    },

    // Connection helpers
    isSocketReady: () => context.isConnected,
    getConnectionId: () => context.socketId,
  };
};
