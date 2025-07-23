import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MessagesContext } from "./MessageContext";
import type { Conversation, User } from "../lib/mockData";
import { mockUsers } from "../lib/mockData";
import {
  fetchConversations,
  fetchConversationById,
  sendMessage as sendMessageApi,
  markAsRead,
  // fetchCurrentUser
} from "../utils/services";

interface MessagesProviderProps {
  children: ReactNode;
}

export function MessagesProvider({ children }: MessagesProviderProps) {
  const [currentUser] = useState<User>(mockUsers[0]); // User hiện tại luôn là user đầu tiên trong mockUsers
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      try {
        const convos = await fetchConversations();
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
  const selectConversation = useCallback(async (id: number) => {
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
  }, []);

  // Gửi tin nhắn
  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversation) return;

    try {
      // Gọi API để gửi tin nhắn
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
      console.error("Error sending message:", err);
    }
  }, [currentConversation, currentUser.id]);

  const value = {
    currentUser,
    conversations,
    currentConversation,
    isLoading,
    error,
    selectConversation,
    sendMessage
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
