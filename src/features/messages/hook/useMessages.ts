import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { messageAPI, type SendMessageRequest } from '../../../api/message.api';
import { conversationAPI } from '../../../api/conversation.api';
import type { ConversationMessage } from '../../../api/conversation.api';
import { useSocket } from '@/app/hooks/useSocket';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface UseMessagesReturn {
  messages: ConversationMessage[];
  loading: boolean;
  sending: boolean;
  error: string | null;

  sendMessage: (data: SendMessageRequest) => Promise<ConversationMessage | null>;
  clearMessages: () => void;
  clearError: () => void;
  addMessage: (message: ConversationMessage) => void;
  replaceMessage: (tempId: string, newMessage: ConversationMessage) => void;
  loadMessages: (conversationId: string) => Promise<void>;
}

export const useMessages = (conversationId?: string): UseMessagesReturn => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { onMessageReceived } = useSocket();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Append message if not duplicate
  const addMessage = useCallback((message: ConversationMessage) => {
    setMessages(prev => {
      if (prev.some(m => m.id === message.id)) return prev;

      return [...prev, message];
    });
  }, []);

  // Replace a temporary message (tempId) with the server message
  const replaceMessage = useCallback((tempId: string, newMessage: ConversationMessage) => {
    setMessages(prev => prev.map(m => m.id === tempId ? newMessage : m));
  }, []);

  // Load messages from API and normalize order to chronological: old -> new
  const loadMessages = useCallback(async (convId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversationAPI.getConversationMessages(convId);
      if (response.code === 200) {
        const items: ConversationMessage[] = response.result.items || [];

        // detect order: if first is newer than last, reverse so state becomes old->new
        if (items.length >= 2) {
          const first = new Date(items[0].sentAt).getTime();
          const last = new Date(items[items.length - 1].sentAt).getTime();
          if (first > last) items.reverse();
        }

        setMessages(items);
      } else {
        setMessages([]);
      }
    } catch (err: unknown) {
      const errorMessage = (err as ApiError).response?.data?.message || 'Không thể tải tin nhắn';
      setError(errorMessage);
      toast.error(errorMessage);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear messages when conversation changes
  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  // Nhận message từ socket và thêm vào state (normalize payload và handle replace)
  useEffect(() => {
    let mounted = true;

    const handleMessageReceived = (data: unknown) => {
      if (!mounted) return;
      const raw = data as any;
      const payload = raw?.result ?? raw?.data ?? raw;

      // debug log shape
      console.log('[socket] normalized payload:', payload);

      if (!payload || !payload.conversationId) return;
      if (String(payload.conversationId) !== String(conversationId)) return;

      // Fix xác định mine: so sánh đúng trường id của người gửi với currentUserId
      let mine = false;
      // Nếu BE trả về senderId là id người gửi, so sánh với currentUserId
      // Nếu BE trả về receiverId là id người nhận, cần sửa lại ở đây
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const currentUserId = storedUser ? (JSON.parse(storedUser).id as string) : undefined;
      if (currentUserId && String(payload.senderId) === String(currentUserId)) {
        mine = true;
      }
      const messageData: ConversationMessage = { ...payload, mine };

      // If server provides clientTempId, replace the temp message
      if (payload.clientTempId) {
        replaceMessage(payload.clientTempId, messageData);
      } else {
        // avoid duplicates by id
        setMessages(prev => {
          if (prev.some(m => m.id === messageData.id)) return prev;
          return [...prev, messageData];
        });
      }
    };

    const maybeOff = onMessageReceived(handleMessageReceived);

    return () => {
      mounted = false;
      if (typeof maybeOff === 'function') maybeOff();
    };
  }, [conversationId, onMessageReceived, replaceMessage]);

  const sendMessage = useCallback(async (data: SendMessageRequest): Promise<ConversationMessage | null> => {
    try {
      setSending(true);
      setError(null);

      const response = await messageAPI.sendMessage({
        conversationId: data.conversationId,
        content: data.content,
        type: data.type,
        files: data.files,
        // if backend supports clientTempId, caller should include it in send body
      });

      if (response.code === 200) {
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
    addMessage,
    replaceMessage,
    loadMessages,
  };
};
