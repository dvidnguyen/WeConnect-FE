import api from './axios';
import type {
  Conversation,
  Message,
  ConversationMember,
  MessageReaction,
  SendMessageRequest
} from '@/features/messages/types/messages.types';

export const messageApi = {
  // Conversations
  getConversations: () =>
    api.get<Conversation[]>('/api/conversations'),

  getConversationById: (id: string) =>
    api.get<Conversation>(`/api/conversations/${id}`),

  createPrivateConversation: (userId: string) =>
    api.post<Conversation>('/api/conversations/private', { user_id: userId }),

  createGroupConversation: (name: string, memberIds: string[]) =>
    api.post<Conversation>('/api/conversations/group', { name, member_ids: memberIds }),

  // Messages
  getMessages: (conversationId: string, page = 1, limit = 50) =>
    api.get<{
      messages: Message[];
      hasMore: boolean;
    }>(`/api/conversations/${conversationId}/messages?page=${page}&limit=${limit}`),

  sendMessage: (data: SendMessageRequest) =>
    api.post<Message>(`/api/conversations/${data.conversationId}/messages`, {
      content: data.content,
      type: 'text', // Default to text, can be extended
      reply_to_message_id: data.replyToMessageId
    }),

  // Message reactions
  addReaction: (messageId: string, emoji: string) =>
    api.post<MessageReaction>(`/api/messages/${messageId}/reactions`, { emoji }),

  removeReaction: (messageId: string, reactionId: string) =>
    api.delete(`/api/messages/${messageId}/reactions/${reactionId}`),

  // Read receipts
  markAsRead: (conversationId: string, messageId: string) =>
    api.post(`/api/conversations/${conversationId}/messages/${messageId}/read`),

  // Group management
  addMember: (conversationId: string, userId: string) =>
    api.post<ConversationMember>(`/api/conversations/${conversationId}/members`, { user_id: userId }),

  removeMember: (conversationId: string, memberId: string) =>
    api.delete(`/api/conversations/${conversationId}/members/${memberId}`),

  updateMemberRole: (conversationId: string, memberId: string, role: 'admin' | 'member') =>
    api.put<ConversationMember>(`/api/conversations/${conversationId}/members/${memberId}`, { role }),
};
