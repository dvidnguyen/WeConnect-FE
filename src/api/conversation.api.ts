import api from './axios';
import { API_ENDPOINTS } from './endpoints';

// Types for conversation API
export interface CreateConversationRequest {
  type: 'direct' | 'group';
  targetUserId?: string; // Required for DIRECT
  name?: string; // Required for GROUP
  memberIds?: string[]; // For GROUP type (can be empty, creator will be auto-added)
}

export interface CreateConversationResponse {
  conversationId: string;
  created: boolean;
}

export interface Conversation {
  conversationId: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string | null;
  unreadCount: number;
  lastMessageSenderId: string | null;
  lastMessageId: string | null;
  lastMessageTime: string | null;
  lastMessage: string | null;
}

export interface ConversationListResponse {
  code: number;
  result: Conversation[];
}

// Message related interfaces for conversation messages
export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'file' | 'voice';
  receipt: number;
  reaction: number;
  url: string[];
  urlDownload: string[];
  content: string;
  sentAt: string;
  mine: boolean;
  senderAvatar: string | null;
}

export interface PageInfo {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface ConversationMessagesResponse {
  code: number;
  message: string;
  result: {
    items: ConversationMessage[];
    pageInfo: PageInfo;
  };
}

// API Methods
export const conversationAPI = {
  // Create new conversation
  createConversation: async (data: CreateConversationRequest): Promise<CreateConversationResponse> => {
    const response = await api.post(API_ENDPOINTS.CONVERSATIONS.CREATE, data);
    return response.data;
  },

  // Get all conversations for current user
  getConversations: async (): Promise<ConversationListResponse> => {
    const response = await api.get(API_ENDPOINTS.CONVERSATIONS.LIST);
    return response.data;
  },

  // Delete conversation
  // deleteConversation: async (id: string): Promise<void> => {
  //   await api.delete(API_ENDPOINTS.CONVERSATIONS.DELETE(id));
  // },

  // Get messages for a specific conversation
  getConversationMessages: async (
    conversationId: string,
    limit: number = 15,
    before?: string,
    after?: string
  ): Promise<ConversationMessagesResponse> => {
    const response = await api.get(API_ENDPOINTS.CONVERSATIONS.GET_PER_CONSERVATION(conversationId, limit, before, after));
    return response.data;
  },
  inviteMember: async (conversationId: string, userId: string): Promise<void> => {
    const response = await api.post(API_ENDPOINTS.CONVERSATIONS.INVITE(conversationId), { userId });
    return response.data;
  },
};
