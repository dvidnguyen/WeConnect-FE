import type { Conversation, Message } from "@/features/messages/types/messages.types";
import { mockConversations } from "@/data/mock/messages.mock";

interface ConversationWithPagination extends Conversation {
  hasMoreMessages?: boolean;
}

export const messageService = {
  // Get all conversations
  getConversations: async (): Promise<Conversation[]> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockConversations;
  },

  // Get conversation by ID with pagination
  getConversationById: async (
    id: string,
    options?: { page?: number; limit?: number }
  ): Promise<ConversationWithPagination | undefined> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 100));
    const conversation = mockConversations.find(c => c.id === id);

    if (!conversation) return undefined;

    // Simulate pagination
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const startIndex = Math.max(0, conversation.messages.length - (page * limit));
    const endIndex = Math.min(conversation.messages.length, startIndex + limit);

    return {
      ...conversation,
      messages: conversation.messages.slice(startIndex, endIndex),
      hasMoreMessages: startIndex > 0
    };
  },

  // Load more messages for a conversation
  loadMoreMessages: async (
    conversationId: string,
    page: number,
    limit: number
  ): Promise<Message[]> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 100));
    const conversation = mockConversations.find(c => c.id === conversationId);

    if (!conversation) return [];

    const startIndex = Math.max(0, conversation.messages.length - (page * limit));
    const endIndex = Math.min(conversation.messages.length, startIndex + limit);

    return conversation.messages.slice(startIndex, endIndex);
  },

  // Send a new message
  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    const conversation = mockConversations.find(c => c.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Message = {
      id: Math.max(...conversation.messages.map(m => m.id)) + 1,
      senderId: "1", // Current user ID
      content,
      timestamp: new Date().toISOString(),
      read: true
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = {
      content,
      timestamp: newMessage.timestamp,
      senderId: "1", // Current user ID
      read: true
    };

    return newMessage;
  },

  // Mark all messages in a conversation as read
  markConversationAsRead: async (conversationId: string): Promise<void> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 200));
    const conversation = mockConversations.find(c => c.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.messages.forEach(m => {
      m.read = true;
    });
    conversation.unreadCount = 0;
  },
};
