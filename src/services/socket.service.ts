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

  // store listeners so they can be attached once socket connects
  private queuedListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  // Callback handlers cho friend events (kept for compatibility)
  private friendRequestCallback?: (data: NotificationResponse) => void;
  private friendAcceptedCallback?: (data: NotificationResponse) => void;
  private friendRejectedCallback?: (data: NotificationResponse) => void;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io('http://localhost:8099', {
      // many servers expect auth instead of query; adjust if your BE uses auth
      // auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // attach core internal listeners and also attach queued listeners
    this.setupEventListeners();
  }

  protected setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully, id=', this.socket?.id);
      // attach any queued listeners that were registered before connect
      for (const [event, handlers] of Array.from(this.queuedListeners.entries())) {
        handlers.forEach(h => {
          try {
            this.socket?.on(event, h);
          } catch (e) {
            console.warn('Failed attach queued listener', event, e);
          }
        });
      }
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

    // Friend-related events (also call queued ones if any)
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

  // Methods để register callbacks cho friend events (backwards compat)
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

  /**
   * emit with optional ack callback
   * usage: emit('event', payload, (ack) => console.log(ack))
   */
  protected emit(event: string, data?: unknown, ack?: (res: unknown) => void) {
    if (this.socket?.connected) {
      if (ack && typeof ack === 'function') {
        this.socket.emit(event, data, ack);
      } else {
        this.socket.emit(event, data);
      }
    } else {
      console.warn('❌ Cannot emit: Socket not connected', { event, data });
    }
  }

  /**
   * Register listener. This will be queued and attached when socket connects.
   * If socket already exists, attach immediately.
   */
  on(event: string, callback: (data: unknown) => void) {
    // store in queue map
    if (!this.queuedListeners.has(event)) this.queuedListeners.set(event, new Set());
    this.queuedListeners.get(event)!.add(callback);

    // if socket present attach now
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove a previously registered listener. If no callback provided, remove all for that event.
   */
  off(event: string, callback?: (data: unknown) => void) {
    // remove from socket if connected
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        // remove all queued handlers from actual socket
        const cbs = this.queuedListeners.get(event);
        cbs?.forEach(cb => {
          try { this.socket?.off(event, cb); } catch (e) { /* ignore */ }
        });
      }
    }
    // remove from queued map
    if (callback) {
      this.queuedListeners.get(event)?.delete(callback);
    } else {
      this.queuedListeners.delete(event);
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
