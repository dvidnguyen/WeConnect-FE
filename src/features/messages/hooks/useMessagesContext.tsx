import React, { createContext, useState, useEffect } from 'react';
import type { Conversation } from '@/features/messages/types/messages.types';
import type { User } from '@/shared/types';
import { mockUsers } from '@/data/mock/messages.mock';
import { messageService } from '@/features/messages/services/messages.service';

// Định nghĩa kiểu dữ liệu cho Context
interface MessagesContextType {
  currentUser: User;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  sendMessage: (content: string) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
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
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 20;

  // Lấy tất cả cuộc trò chuyện khi component mount
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getConversations();
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
  const selectConversation = async (id: string) => {
    setIsLoading(true);
    try {
      // Reset pagination state
      setCurrentPage(1);
      setHasMoreMessages(true);

      const conversation = await messageService.getConversationById(id, {
        page: 1,
        limit: PAGE_SIZE
      });

      if (conversation) {
        setCurrentConversation(conversation);
        setHasMoreMessages(conversation.hasMoreMessages || false);

        // Đánh dấu tất cả tin nhắn là đã đọc
        await messageService.markConversationAsRead(id);
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
      const newMessage = await messageService.sendMessage(currentConversation.id, content);

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

  // Load more messages
  const loadMoreMessages = async () => {
    if (!currentConversation || !hasMoreMessages || isLoading) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const moreMessages = await messageService.loadMoreMessages(
        currentConversation.id,
        nextPage,
        PAGE_SIZE
      );

      if (moreMessages.length < PAGE_SIZE) {
        setHasMoreMessages(false);
      }

      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, ...moreMessages]
        };
      });

      setCurrentPage(nextPage);
    } catch (err) {
      setError('Không thể tải thêm tin nhắn');
      console.error("Error loading more messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    conversations,
    currentConversation,
    isLoading,
    error,
    hasMoreMessages,
    sendMessage,
    selectConversation,
    loadMoreMessages
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
