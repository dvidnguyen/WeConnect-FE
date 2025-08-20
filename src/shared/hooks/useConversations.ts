import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { conversationAPI, type Conversation, type CreateConversationRequest } from '../../api/conversation.api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;

  // Actions
  createConversation: (data: CreateConversationRequest) => Promise<Conversation | null>;
  getConversations: () => Promise<void>;
  getConversationById: (id: string) => Promise<Conversation | null>;
  deleteConversation: (id: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createConversation = useCallback(async (data: CreateConversationRequest): Promise<Conversation | null> => {
    try {
      setLoading(true);
      setError(null);

      const newConversation = await conversationAPI.createConversation(data);

      // Add new conversation to the list
      setConversations(prev => [newConversation, ...prev]);

      toast.success(
        data.type === 'DIRECT'
          ? 'Cuộc trò chuyện đã được tạo'
          : `Nhóm "${data.name}" đã được tạo`
      );

      return newConversation;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tạo cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversations = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversationAPI.getConversations();
      setConversations(response.conversations);
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tải danh sách cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversationById = useCallback(async (id: string): Promise<Conversation | null> => {
    try {
      setLoading(true);
      setError(null);

      const conversation = await conversationAPI.getConversationById(id);

      // Update conversation in list if it exists
      setConversations(prev =>
        prev.map(conv => conv.id === id ? conversation : conv)
      );

      return conversation;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tải cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await conversationAPI.deleteConversation(id);

      // Remove conversation from list
      setConversations(prev => prev.filter(conv => conv.id !== id));

      toast.success('Đã xóa cuộc trò chuyện');
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể xóa cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    createConversation,
    getConversations,
    getConversationById,
    deleteConversation,
    clearError,
  };
};
