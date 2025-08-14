import { io } from 'socket.io-client';

// Interface match với NotificationResponse từ BE
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
  createdAt: string; // LocalDateTime từ BE
}

interface FriendRequest {
  to: string;
  body?: string;
}

interface FriendReactionRequest {
  id: string; // Friend request ID
}

interface FriendEventData {
  // Có thể là NotificationResponse hoặc data khác
  notification?: NotificationResponse;
  [key: string]: unknown;
}

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

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

    // Friend-related events (match với BE)
    this.socket.on('friend', (data: FriendEventData) => {
      console.log('👤 Friend request received:', data);
      // Đây là event khi nhận friend request
    });

    this.socket.on('friend-accepted', (data: FriendEventData) => {
      console.log('✅ Friend request accepted:', data);
      // Event khi friend request được accept
    });

    this.socket.on('friend-rejected', (data: FriendEventData) => {
      console.log('❌ Friend request rejected:', data);
      // Event khi friend request bị reject
    });

    // General notifications
    this.socket.on('notification', (data: unknown) => {
      console.log('🔔 Notification:', data);
    });
  }

  // Friend request methods (match với BE service)
  sendFriendRequest(userId: string, message?: string) {
    // BE expects: FriendRequest { to: string, body?: string }
    this.emit('send_friend_request', {
      to: userId,
      body: message || 'Hi! Let\'s be friends!'
    });
    console.log(`📤 Sending friend request to user: ${userId}`);
  }

  acceptFriendRequest(requestId: string) {
    // BE expects: FriendReactionRequest { id: string }
    this.emit('accept_friend_request', { id: requestId });
    console.log(`✅ Accepting friend request: ${requestId}`);
  }

  rejectFriendRequest(requestId: string) {
    // BE expects: FriendReactionRequest { id: string }
    this.emit('reject_friend_request', { id: requestId });
    console.log(`❌ Rejecting friend request: ${requestId}`);
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

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
