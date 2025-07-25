import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MessagesContext } from "./useMessagesContext";
import type { Conversation } from "@/features/messages/types/messages.types";
import type { User } from "@/shared/types";
import { mockUsers } from "@/data/mock/messages.mock";
import { messageService } from "@/features/messages/services/messages.service";

interface MessagesProviderProps {
  children: ReactNode;
}

export function MessagesProvider({ children }: MessagesProviderProps) {
  const [currentUser] = useState<User>(mockUsers[0]); // User hiện tại luôn là user đầu tiên trong mockUsers
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 20;

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      try {
        const convos = await messageService.getConversations();
        setConversations(convos);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách cuộc trò chuyện');
        console.error("Error fetching initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialData();
  }, []);

  // Chọn cuộc trò chuyện
  const selectConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Reset pagination state
      setCurrentPage(1);
      setHasMoreMessages(true);

      // Load conversation với 20 tin nhắn mới nhất
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
  }, [PAGE_SIZE]);

  // Gửi tin nhắn
  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversation) return;

    try {
      // Gọi API để gửi tin nhắn
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
      console.error("Error sending message:", err);
    }
  }, [currentConversation, currentUser.id]);

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
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
  }, [currentConversation, hasMoreMessages, isLoading, currentPage, PAGE_SIZE]);

  const value = {
    currentUser,
    conversations,
    currentConversation,
    isLoading,
    error,
    hasMoreMessages,
    selectConversation,
    sendMessage,
    loadMoreMessages
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
