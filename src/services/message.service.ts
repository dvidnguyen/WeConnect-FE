// src/services/message.service.ts
import { socketService } from './socket.service';

export interface ReceiptPayload {
  conversationId?: string;
  messageId?: string;
  userId?: string;
  readAt?: string;
}

/**
 * MessageService - nhẹ, tương thích với code gốc nhưng:
 * - normalize incoming message shape
 * - compute authoritative mine only if senderId & currentUserId available
 * - onX returns an unsubscribe function for proper cleanup
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
    socketService.on('message', (data: any) => {
      // normalize but DON'T force mine false unconditionally
      const normalized = this.normalizeIncomingMessage(data);
      try { this.messageReceivedCallback?.(normalized); } catch (e) { console.error(e) }
    });

    socketService.on('receipt-update', (data: ReceiptPayload) => {
      try { this.receiptUpdateCallback?.(data); } catch (e) { console.error(e) }
    });

    socketService.on('receipt-ack', (data: ReceiptPayload) => {
      try { this.receiptAckCallback?.(data); } catch (e) { console.error(e) }
    });

    socketService.on('reaction-update', (data: any) => {
      try { this.reactionUpdateCallback?.(data); } catch (e) { console.error(e) }
    });

    socketService.on('reaction-ack', (data: any) => {
      try { this.reactionAckCallback?.(data); } catch (e) { console.error(e) }
    });

    socketService.on('conversation:update', (data: any) => {
      try { this.conversationUpdateCallback?.(data); } catch (e) { console.error(e) }
      try { window.dispatchEvent(new CustomEvent('conversation:update', { detail: data })); } catch { }
    });
  }

  // registrations - return unsubscribe for cleanup (compatible)
  onMessageReceived(cb: (data: any) => void) {
    this.messageReceivedCallback = cb;
    return () => { if (this.messageReceivedCallback === cb) this.messageReceivedCallback = undefined; }
  }
  onReceiptUpdate(cb: (payload: ReceiptPayload) => void) {
    this.receiptUpdateCallback = cb;
    return () => { if (this.receiptUpdateCallback === cb) this.receiptUpdateCallback = undefined; }
  }
  onReceiptAck(cb: (payload: ReceiptPayload) => void) {
    this.receiptAckCallback = cb;
    return () => { if (this.receiptAckCallback === cb) this.receiptAckCallback = undefined; }
  }
  onConversationUpdate(cb: (payload: any) => void) {
    this.conversationUpdateCallback = cb;
    return () => { if (this.conversationUpdateCallback === cb) this.conversationUpdateCallback = undefined; }
  }
  onReactionUpdate(cb: (payload: any) => void) {
    this.reactionUpdateCallback = cb;
    return () => { if (this.reactionUpdateCallback === cb) this.reactionUpdateCallback = undefined; }
  }
  onReactionAck(cb: (payload: any) => void) {
    this.reactionAckCallback = cb;
    return () => { if (this.reactionAckCallback === cb) this.reactionAckCallback = undefined; }
  }

  markConversationRead(conversationId: string, lastMessageId?: string) {
    const payload: ReceiptPayload = { conversationId, messageId: lastMessageId, readAt: new Date().toISOString() };
    try { window.dispatchEvent(new CustomEvent('conversation:update', { detail: { conversationId, unreadCount: 0 } })); } catch { }
    try {
      if (socketService.isConnected()) {
        socketService.emit('receipt', payload, (ack: any) => {
          if (ack && ack.conversationId) {
            try { this.conversationUpdateCallback?.(ack); } catch (e) { }
            try { window.dispatchEvent(new CustomEvent('conversation:update', { detail: ack })); } catch { }
          }
        });
      }
    } catch (e) { console.warn('[messageService] markConversationRead error', e); }
  }

  sendReadReceipt(messageId: string) {
    try {
      if (!socketService.isConnected()) return;
      socketService.emit('receipt', { messageId }, (ack: any) => { /* handled by receipt-ack */ });
    } catch (e) { console.warn('[messageService] sendReadReceipt error', e); }
  }

  sendReaction(messageId: string, like: boolean) {
    try {
      if (!socketService.isConnected()) return;
      socketService.emit('reaction-like', { messageId, like }, (ack: any) => { });
    } catch (e) { console.warn('[messageService] sendReaction error', e); }
  }

  disconnect() {
    this.messageReceivedCallback = undefined;
    this.receiptUpdateCallback = undefined;
    this.receiptAckCallback = undefined;
    this.conversationUpdateCallback = undefined;
    this.reactionUpdateCallback = undefined;
    this.reactionAckCallback = undefined;
    try {
      socketService.off && socketService.off('message');
      socketService.off && socketService.off('receipt-update');
      socketService.off && socketService.off('receipt-ack');
      socketService.off && socketService.off('reaction-update');
      socketService.off && socketService.off('reaction-ack');
      socketService.off && socketService.off('conversation:update');
    } catch (e) { }
  }

  private getCurrentUserId(): string | null {
    try {
      if ((socketService as any).getCurrentUserId) return (socketService as any).getCurrentUserId();
      if ((window as any).__USER__ && (window as any).__USER__.id) return (window as any).__USER__.id;
      return localStorage.getItem('userId') || localStorage.getItem('currentUserId') || null;
    } catch (e) { return null; }
  }

  private normalizeIncomingMessage(raw: any) {
    const msg: any = { ...(raw || {}) };
    msg.id = msg.id ?? msg.messageId ?? null;
    if (!msg.sentAt && msg.createdAt) msg.sentAt = msg.createdAt;
    if (!msg.sentAt) msg.sentAt = new Date().toISOString();
    msg.clientId = msg.clientId ?? msg.client_id ?? msg.tempId ?? null;
    msg.senderId = msg.senderId ?? msg.fromUserId ?? msg.from ?? msg.userId ?? null;

    const cur = this.getCurrentUserId();
    if (msg.senderId && cur !== null) {
      try { msg.mine = String(msg.senderId) === String(cur); } catch { msg.mine = !!msg.mine; }
    } else {
      msg.mine = !!msg.mine; // fallback to server-provided
    }

    msg.type = msg.type ?? 'text';
    msg.content = msg.content ?? msg.text ?? '';
    if (!Array.isArray(msg.url)) {
      if (Array.isArray(msg.urls)) msg.url = msg.urls;
      else if (Array.isArray(msg.attachments)) msg.url = msg.attachments.map((a: any) => a.url).filter(Boolean);
      else msg.url = msg.url ? (Array.isArray(msg.url) ? msg.url : [msg.url]) : [];
    }
    msg.senderName = msg.senderName ?? msg.fromName ?? msg.sender ?? 'Unknown';
    msg.senderAvatar = msg.senderAvatar ?? msg.avatar ?? null;
    return msg;
  }
}

export const messageService = new MessageService();
export default messageService;
