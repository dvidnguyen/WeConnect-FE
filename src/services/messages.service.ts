import type { Conversation, Message } from "@/lib/mockData";
import { mockConversations } from "@/lib/mockData";

export const messageService = {
  // Get all conversations
  getConversations: async (): Promise<Conversation[]> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockConversations;
    // When API is ready:
    // return await api.get('/api/conversations');
  },

  // Get conversation by ID
  getConversationById: async (id: number): Promise<Conversation | undefined> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockConversations.find(c => c.id === id);
    // When API is ready:
    // return await api.get(`/api/conversations/${id}`);
  },

  // Send a new message
  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    const conversation = mockConversations.find(c => c.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Message = {
      id: Math.max(...conversation.messages.map(m => m.id)) + 1,
      senderId: 0, // Current user
      content,
      timestamp: new Date().toISOString(),
      read: true
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = {
      content,
      timestamp: newMessage.timestamp,
      senderId: 0,
      read: true
    };

    return newMessage;
    // When API is ready:
    // return await api.post(`/api/conversations/${conversationId}/messages`, { content });
  },

  // Mark all messages in a conversation as read
  markConversationAsRead: async (conversationId: number): Promise<void> => {
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
    // When API is ready:
    // return await api.put(`/api/conversations/${conversationId}/read`);
  },
};
