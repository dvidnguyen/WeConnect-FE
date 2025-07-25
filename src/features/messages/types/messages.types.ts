// Messages feature types
import type { User, Attachment, PaginationParams } from '@/shared/types';

export interface Message {
  id: number;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
  editedAt?: string;
  replyTo?: {
    messageId: number;
    content: string;
    senderName: string;
  };
}

export interface LastMessage {
  content: string;
  timestamp: string;
  senderId: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: LastMessage;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface MessagesContextType {
  currentUser: User;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  selectConversation: (id: string) => Promise<void>;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  markAsRead: (conversationId: string) => void;
  deleteMessage: (messageId: number) => void;
  editMessage: (messageId: number, newContent: string) => void;
}

export interface MessagesPaginationOptions extends PaginationParams {
  conversationId: string;
  before?: string; // timestamp
  after?: string;  // timestamp
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments?: File[];
  replyToMessageId?: number;
}

export interface CreateConversationRequest {
  participantIds: string[];
  isGroup?: boolean;
  groupName?: string;
  initialMessage?: string;
}
