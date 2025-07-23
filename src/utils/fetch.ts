import type { Conversation, Message } from "../lib/mockData";
import { mockConversations, mockUsers } from "../lib/mockData";

// Đây là file service.ts để quản lý các API calls
// Hiện tại chúng ta đang dùng mock data, nhưng sau này có thể thay thế bằng axios để gọi API thật

// API để lấy danh sách cuộc trò chuyện
export const fetchConversations = (): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConversations);
    }, 200); // Giả lập độ trễ mạng
  });
};

// API để lấy chi tiết một cuộc trò chuyện theo ID
export const fetchConversationById = (id: number): Promise<Conversation | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = mockConversations.find(c => c.id === id);
      resolve(conversation);
    }, 100); // Giả lập độ trễ mạng
  });
};

// API để gửi tin nhắn mới
export const sendMessage = (conversationId: number, content: string): Promise<Message> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const conversation = mockConversations.find(c => c.id === conversationId);

      if (conversation) {
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

        resolve(newMessage);
      } else {
        reject(new Error('Không tìm thấy cuộc trò chuyện'));
      }
    }, 300);
  });
};

// API để đánh dấu tất cả tin nhắn trong một cuộc trò chuyện là đã đọc
export const markAsRead = (conversationId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const conversation = mockConversations.find(c => c.id === conversationId);

      if (conversation) {
        conversation.messages.forEach(m => {
          m.read = true;
        });
        conversation.unreadCount = 0;

        resolve();
      } else {
        reject(new Error('Không tìm thấy cuộc trò chuyện'));
      }
    }, 200);
  });
};

// API để lấy thông tin người dùng hiện tại
export const fetchCurrentUser = (): Promise<typeof mockUsers[0]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Giả định người dùng hiện tại luôn là mockUsers[0]
      resolve(mockUsers[0]);
    }, 100);
  });
};

// API để lấy danh sách tất cả người dùng
export const fetchAllUsers = (): Promise<typeof mockUsers> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 150);
  });
};
