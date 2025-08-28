// src/services/conversation.service.ts
import { socketService } from './socket.service';

type ConversationUpdatePayload = {
  conversationId: string;
  unreadCount?: number;
  lastMessage?: any;
  lastMessageTime?: string;
};

class ConversationService {
  private onUpdateCb?: (payload: ConversationUpdatePayload) => void;

  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    // Listen server -> forward to registered callback + window event (optimistic consumers)
    socketService.on('conversation:update', (data: ConversationUpdatePayload) => {
      // forward to callback if registered
      try {
        this.onUpdateCb?.(data);
      } catch (e) {
        console.warn('[ConversationService] onUpdateCb error', e);
      }

      // also dispatch a window event so any component can listen via window.addEventListener
      try {
        window.dispatchEvent(new CustomEvent('conversation:update', { detail: data }));
      } catch (e) {
        // ignore for SSR or non-browser env
      }
    });
  }

  /**
   * Register a JS callback for conversation:update events
   */
  onConversationUpdate(cb: (payload: ConversationUpdatePayload) => void) {
    this.onUpdateCb = cb;
  }

  /**
   * Remove previously set callback
   */
  offConversationUpdate() {
    this.onUpdateCb = undefined;
  }

  /**
   * Optional: emit a client-initiated event to server (if your server supports it)
   * e.g. request to reset unreadCount — ensure backend has matching handler before use.
   */
  resetUnreadCount(conversationId: string) {
    if (!socketService.isConnected()) return;
    try {
      socketService.emit('conversation:reset', { conversationId });
    } catch (e) {
      console.warn('[ConversationService] resetUnreadCount error', e);
    }
  }
}

export const conversationService = new ConversationService();
export default conversationService;
