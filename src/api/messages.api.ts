import api from './axios';
import type { Conversation, Message } from '@/features/messages/types/messages.types';

export const messageApi = {
  // API endpoints
  getConversations: () =>
    api.get<Conversation[]>('/api/conversations'),

  getConversationById: (id: number) =>
    api.get<Conversation>(`/api/conversations/${id}`),

  sendMessage: (conversationId: number, content: string) =>
    api.post<Message>(`/api/conversations/${conversationId}/messages`, { content }),

  markAsRead: (conversationId: number) =>
    api.put(`/api/conversations/${conversationId}/read`),
};
