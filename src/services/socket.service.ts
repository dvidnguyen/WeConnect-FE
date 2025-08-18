import { io } from 'socket.io-client';

// Interface match chính xác với NotificationResponse từ BE
interface NotificationResponse {
  id: string;
  body: string;
  title: string; // username của người gửi
  type: string; // "FRIEND"
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  relatedId?: string; // friend.getId()
  createdAt: string; // LocalDateTime từ BE
}

// Interface cho FriendRequest BE expects
interface FriendRequestPayload {
  to: string;
  body?: string;
}

// Interface cho FriendReactionRequest BE expects
interface FriendReactionPayload {
  id: string; // Friend request ID
}

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

  // Callback handlers cho friend events
  private friendRequestCallback?: (data: NotificationResponse) => void;
  private friendAcceptedCallback?: (data: NotificationResponse) => void;
  private friendRejectedCallback?: (data: NotificationResponse) => void;

  connect(token: string) {
    if (this.socket?.connected) {
      alert('Socket already connected line 37');
      return;
    }

    // Kết nối với server với token
    this.socket = io('http://localhost:8099', {
      query: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      // alert('✅ Socket connected successfully');
      // console.log('Socket ID:', this.socket?.id);
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

    // Friend-related events (match với BE SendRequestFriendService)
    this.socket.on('friend', (notificationData: NotificationResponse) => {
      console.log('👤 Friend request received:', notificationData);
      console.log('📋 Friend request details:', {
        id: notificationData.id,
        from: notificationData.senderName,
        message: notificationData.body,
        avatar: notificationData.senderAvatarUrl
      });

      // Call registered callback if exists
      this.friendRequestCallback?.(notificationData);
    });

    this.socket.on('friend-accepted', (notificationData: NotificationResponse) => {
      console.log('✅ Friend request accepted:', notificationData);
      console.log('📋 Accept details:', {
        id: notificationData.id,
        from: notificationData.senderName,
        message: notificationData.body,
        avatar: notificationData.senderAvatarUrl
      });

      // Call registered callback if exists
      this.friendAcceptedCallback?.(notificationData);
    });

    this.socket.on('friend-rejected', (notificationData: NotificationResponse) => {
      console.log('❌ Friend request rejected:', notificationData);
      console.log('📋 Reject details:', {
        id: notificationData.id,
        from: notificationData.senderName,
        message: notificationData.body,
        avatar: notificationData.senderAvatarUrl
      });

      // Call registered callback if exists
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

  // Friend request methods (match với BE endpoints)
  sendFriendRequest(userId: string, message?: string) {
    // BE SendRequestFriendService expects: FriendRequest { to: string, body?: string }
    const payload: FriendRequestPayload = {
      to: userId,
      body: message || 'Xin chào! Hãy kết bạn với tôi nhé!'
    };

    console.log('📤 Sending friend request payload:', payload);
    this.emit('send_friend_request', payload);
  }

  acceptFriendRequest(requestId: string) {
    // BE SendRequestFriendService.acceptFriendRequest expects: FriendReactionRequest { id: string }
    const payload: FriendReactionPayload = { id: requestId };

    console.log('✅ Accepting friend request payload:', payload);
    this.emit('accept_friend_request', payload);
  }

  rejectFriendRequest(requestId: string) {
    // BE SendRequestFriendService.rejectFriendRequest expects: FriendReactionRequest { id: string }
    const payload: FriendReactionPayload = { id: requestId };

    console.log('❌ Rejecting friend request payload:', payload);
    this.emit('reject_friend_request', payload);
  }

  // Generic socket methods
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: unknown) {
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

// FINAL CLEAN EXPORT
export const socketService = new SocketService();
