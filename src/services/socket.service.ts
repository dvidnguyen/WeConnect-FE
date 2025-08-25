import { io } from 'socket.io-client';

// Interface match chính xác với NotificationResponse từ BE
export interface NotificationResponse {
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

// Interface cho FriendRequest BE expects
interface FriendRequestPayload {
  to: string;
  body?: string;
}

// Interface cho FriendReactionRequest BE expects
interface FriendReactionPayload {
  id: string;
}

class SocketService {
  protected socket: ReturnType<typeof io> | null = null;

  // Callback handlers cho friend events
  private friendRequestCallback?: (data: NotificationResponse) => void;
  private friendAcceptedCallback?: (data: NotificationResponse) => void;
  private friendRejectedCallback?: (data: NotificationResponse) => void;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io('http://localhost:8099', {
      query: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventListeners();
  }

  protected setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
    });

    this.socket.on('connected', (data: unknown) => {
      console.log('✅ Server confirmed connection:', data);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.on('error', (error: Error) => {
      console.error('❌ Socket error:', error);
    });

    // Friend-related events
    this.socket.on('friend', (notificationData: NotificationResponse) => {
      this.friendRequestCallback?.(notificationData);
    });

    this.socket.on('friend-accepted', (notificationData: NotificationResponse) => {
      this.friendAcceptedCallback?.(notificationData);
    });

    this.socket.on('friend-rejected', (notificationData: NotificationResponse) => {
      this.friendRejectedCallback?.(notificationData);
    });

    // General notifications
    this.socket.on('notification', (data: unknown) => {
      console.log('🔔 Notification:', data);
    });
  }

  // Methods để register callbacks cho friend events
  onFriendRequest(callback: (data: NotificationResponse) => void) {
    this.friendRequestCallback = callback;
  }

  onFriendAccepted(callback: (data: NotificationResponse) => void) {
    this.friendAcceptedCallback = callback;
  }

  onFriendRejected(callback: (data: NotificationResponse) => void) {
    this.friendRejectedCallback = callback;
  }

  // Friend request methods
  sendFriendRequest(userId: string, message?: string) {
    const payload: FriendRequestPayload = {
      to: userId,
      body: message || 'Xin chào! Hãy kết bạn với tôi nhé!'
    };
    this.emit('send_friend_request', payload);
  }

  acceptFriendRequest(requestId: string) {
    const payload: FriendReactionPayload = { id: requestId };
    this.emit('accept_friend_request', payload);
  }

  rejectFriendRequest(requestId: string) {
    const payload: FriendReactionPayload = { id: requestId };
    this.emit('reject_friend_request', payload);
  }

  // Generic socket methods
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  protected emit(event: string, data?: unknown) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('❌ Cannot emit: Socket not connected');
    }
  }

  on(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: unknown) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();