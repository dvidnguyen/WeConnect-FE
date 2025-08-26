// src/services/message.service.ts
import { socketService } from './socket.service';

export interface ReceiptPayload {
  conversationId?: string;
  messageId?: string;
  userId?: string;
  readAt?: string;
}

/**
 * MessageService (FE) - mapping đúng các event backend hiện có:
 * - listen: 'receipt-update', 'receipt-ack', 'reaction-update', 'reaction-ack', 'conversation:update', 'message'...
 * - emit: 'receipt' (mark read), 'reaction-like' (like/unlike)
 * - dispatch local window 'conversation:update' event for optimistic unread sync
 */
class MessageService {
  private messageReceivedCallback?: (data: any) => void;
  private receiptUpdateCallback?: (data: ReceiptPayload) => void;
  private receiptAckCallback?: (data: ReceiptPayload) => void;
  private conversationUpdateCallback?: (data: any) => void;
  private reactionUpdateCallback?: (data: any) => void;
  private reactionAckCallback?: (data: any) => void;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    // new message from server
    socketService.on('message', (data: any) => {
      this.messageReceivedCallback?.(data);
    });

    // read receipt broadcast from server (others read)
    socketService.on('receipt-update', (data: ReceiptPayload) => {
      this.receiptUpdateCallback?.(data);
    });

    // ack returned to reader client
    socketService.on('receipt-ack', (data: ReceiptPayload) => {
      this.receiptAckCallback?.(data);
    });

    // reaction events
    socketService.on('reaction-update', (data: any) => {
      this.reactionUpdateCallback?.(data);
    });

    socketService.on('reaction-ack', (data: any) => {
      this.reactionAckCallback?.(data);
    });

    // conversation-level updates (unreadCount, lastMessage preview...)
    socketService.on('conversation:update', (data: any) => {
      this.conversationUpdateCallback?.(data);
      try {
        window.dispatchEvent(new CustomEvent('conversation:update', { detail: data }));
      } catch (e) { /* ignore SSR */ }
    });
  }

  // registrations
  onMessageReceived(cb: (data: any) => void) {
    this.messageReceivedCallback = cb;
  }
  onReceiptUpdate(cb: (payload: ReceiptPayload) => void) {
    this.receiptUpdateCallback = cb;
  }
  onReceiptAck(cb: (payload: ReceiptPayload) => void) {
    this.receiptAckCallback = cb;
  }
  onConversationUpdate(cb: (payload: any) => void) {
    this.conversationUpdateCallback = cb;
  }
  onReactionUpdate(cb: (payload: any) => void) {
    this.reactionUpdateCallback = cb;
  }
  onReactionAck(cb: (payload: any) => void) {
    this.reactionAckCallback = cb;
  }

  /**
   * Mark entire conversation read up to optional lastMessageId.
   * BE (socket) expects event name 'receipt' and will reply with 'receipt-ack' and broadcast 'receipt-update' + may emit 'conversation:update'.
   */
  markConversationRead(conversationId: string, lastMessageId?: string) {
    const payload: ReceiptPayload = {
      conversationId,
      messageId: lastMessageId,
      readAt: new Date().toISOString()
    };

    // optimistic local dispatch so sidebar can hide badge immediately
    try {
      window.dispatchEvent(new CustomEvent('conversation:update', {
        detail: { conversationId, unreadCount: 0 }
      }));
    } catch (e) {}

    try {
      if (socketService.isConnected()) {
        socketService.emit('receipt', payload, (ack: any) => {
          // server ack may contain authoritative conversation update
          if (ack && ack.conversationId) {
            this.conversationUpdateCallback?.(ack);
            try {
              window.dispatchEvent(new CustomEvent('conversation:update', { detail: ack }));
            } catch (e) {}
          }
        });
      } else {
        // if not connected, we already dispatched optimistic event
      }
    } catch (e) {
      console.warn('[messageService] markConversationRead error', e);
    }
  }

  // backwards-compatible single-message receipt (if still used)
  sendReadReceipt(messageId: string) {
    try {
      if (!socketService.isConnected()) return;
      socketService.emit('receipt', { messageId }, (ack: any) => { /* handled by receipt-ack listener */ });
    } catch (e) {
      console.warn('[messageService] sendReadReceipt error', e);
    }
  }

  // reaction helper
  sendReaction(messageId: string, like: boolean) {
    try {
      if (!socketService.isConnected()) return;
      socketService.emit('reaction-like', { messageId, like }, (ack: any) => {
        // ack handled by reaction-ack listener
      });
    } catch (e) {
      console.warn('[messageService] sendReaction error', e);
    }
  }

  disconnect() {
    this.messageReceivedCallback = undefined;
    this.receiptUpdateCallback = undefined;
    this.receiptAckCallback = undefined;
    this.conversationUpdateCallback = undefined;
    this.reactionUpdateCallback = undefined;
    this.reactionAckCallback = undefined;
  }
}

export const messageService = new MessageService();
export default messageService;
