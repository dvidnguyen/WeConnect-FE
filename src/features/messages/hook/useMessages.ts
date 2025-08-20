import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { messageAPI, type SendMessageRequest } from '../../../api/message.api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface UseMessagesReturn {
  messages: any[];
  loading: boolean;
  sending: boolean;
  error: string | null;

  sendMessage: (data: SendMessageRequest) => Promise<any | null>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useMessages = (): UseMessagesReturn => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);


  const sendMessage = useCallback(async (data: SendMessageRequest): Promise<Message | null> => {
    try {
      setSending(true);
      setError(null);

      const response = await messageAPI.sendMessage({
        conversationId: data.conversationId,
        content: data.content,
        type: data.type,
        files: data.files,
      });

      if (response.code === 200) {
        setMessages(prev => [...prev, response.result]);
        toast.success('Tin nhắn đã được gửi');
        return response.result;
      }
      return null;
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể gửi tin nhắn';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setSending(false);
    }
  }, []);


  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
};
