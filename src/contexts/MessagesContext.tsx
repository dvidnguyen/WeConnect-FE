import React, { createContext, useState, useEffect } from 'react';
import type { Conversation, User } from '@/lib/mockData';
import { mockUsers } from '@/lib/mockData';
import {
  fetchConversations,
  fetchConversationById,
  sendMessage as sendMessageApi,
  markAsRead
} from '@/utils/services';

// Định nghĩa kiểu dữ liệu cho Context
interface MessagesContextType {
  currentUser: User;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
}

// Tạo Context
// eslint-disable-next-line react-refresh/only-export-components
export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Provider component
export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(mockUsers[0]); // User hiện tại luôn là user đầu tiên trong mockUsers
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy tất cả cuộc trò chuyện khi component mount
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchConversations();
        setConversations(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách cuộc trò chuyện');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Chọn một cuộc trò chuyện
  const selectConversation = async (id: number) => {
    setIsLoading(true);
    try {
      const conversation = await fetchConversationById(id);
      if (conversation) {
        setCurrentConversation(conversation);
        // Đánh dấu tất cả tin nhắn là đã đọc
        await markAsRead(id);
        // Cập nhật lại trạng thái cuộc trò chuyện trong danh sách
        setConversations(prevConversations =>
          prevConversations.map(c =>
            c.id === id ? { ...c, unreadCount: 0 } : c
          )
        );
      } else {
        setError('Không tìm thấy cuộc trò chuyện');
      }
    } catch (err) {
      setError('Không thể tải cuộc trò chuyện');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi tin nhắn mới
  const sendMessage = async (content: string) => {
    if (!currentConversation) return;

    try {
      const newMessage = await sendMessageApi(currentConversation.id, content);

      // Cập nhật conversation hiện tại
      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: {
            content,
            timestamp: newMessage.timestamp,
            senderId: currentUser.id,
            read: true
          }
        };
      });

      // Cập nhật danh sách conversations
      setConversations(prevConversations =>
        prevConversations.map(c =>
          c.id === currentConversation.id
            ? {
              ...c,
              lastMessage: {
                content,
                timestamp: newMessage.timestamp,
                senderId: currentUser.id,
                read: true
              }
            }
            : c
        )
      );

    } catch (err) {
      setError('Không thể gửi tin nhắn');
      console.error(err);
    }
  };

  const value = {
    currentUser,
    conversations,
    currentConversation,
    isLoading,
    error,
    sendMessage,
    selectConversation
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
