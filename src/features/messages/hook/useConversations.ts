import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { conversationAPI, type Conversation, type CreateConversationRequest, type ConversationMessage, type PageInfo, type ConversationMessagesResponse } from '../../../api/conversation.api';

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
  createConversation: (data: CreateConversationRequest) => Promise<string | null>;
  createDirectConversation: (targetUserId: string) => Promise<string | null>;
  getConversations: () => Promise<void>;
  getConversationMessages: (conversationId: string, limit?: number, before?: string, after?: string) => Promise<ConversationMessage[]>;
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

  const createConversation = useCallback(async (data: CreateConversationRequest): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversationAPI.createConversation(data);

      // After creating conversation, refresh the conversation list to get updated data
      try {
        const listResponse = await conversationAPI.getConversations();
        if (listResponse.code === 200 && listResponse.result) {
          setConversations(listResponse.result);
        }
      } catch (listError) {
        console.error('Failed to refresh conversation list:', listError);
      }

      toast.success(
        response.created
          ? (data.type === 'direct' ? 'Cuộc trò chuyện đã được tạo' : `Nhóm "${data.name}" đã được tạo`)
          : (data.type === 'direct' ? 'Đã mở cuộc trò chuyện' : 'Đã mở nhóm')
      );

      return response.conversationId;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tạo cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDirectConversation = useCallback(async (targetUserId: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      // Create new direct conversation
      const data: CreateConversationRequest = {
        type: 'direct',
        targetUserId: targetUserId
      };

      const response = await conversationAPI.createConversation(data);

      // After creating conversation, refresh the conversation list to get updated data
      try {
        const listResponse = await conversationAPI.getConversations();
        if (listResponse.code === 200 && listResponse.result) {
          setConversations(listResponse.result);
        }
      } catch (listError) {
        console.error('Failed to refresh conversation list:', listError);
      }

      toast.success(
        response.created ? 'Cuộc trò chuyện đã được tạo' : 'Đã mở cuộc trò chuyện'
      );

      return response.conversationId;
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

      if (response.code === 200 && response.result) {
        setConversations(response.result);
      } else {
        setConversations([]);
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tải danh sách cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
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
      setConversations(prev => prev.filter(conv => conv.conversationId !== id));

      toast.success('Đã xóa cuộc trò chuyện');
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể xóa cuộc trò chuyện';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getConversationMessages = useCallback(async (
    conversationId: string,
    limit: number = 15,
    before?: string,
    after?: string
  ): Promise<ConversationMessage[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversationAPI.getConversationMessages(conversationId, limit, before, after);

      if (response.code === 200) {
        return response.result.items;
      } else {
        return [];
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tải tin nhắn';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conversations,
    loading,
    error,
    createConversation,
    createDirectConversation,
    getConversations,
    getConversationMessages,
    deleteConversation,
    clearError,
  };
};
