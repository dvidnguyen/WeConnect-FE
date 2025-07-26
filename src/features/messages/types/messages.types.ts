// Messages feature types
import type { User, Attachment, PaginationParams } from '@/shared/types';

// Conversation types
export interface Conversation {
  id: string;
  type: "private" | "group";
  name?: string; // For group chats
  created_by: string;
  created_at: string;
  // Populated fields
  creator?: User;
  members?: ConversationMember[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  // Populated field
  user?: User;
}

// Message types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: "text" | "image" | "file" | "voice";
  content: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
  // Populated fields
  sender?: User;
  reactions?: MessageReaction[];
  readReceipts?: ReadReceipt[];
  // Legacy fields for compatibility
  read?: boolean;
  attachments?: Attachment[];
  editedAt?: string;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  reacted_at: string;
  // Populated field
  user?: User;
}

export interface ReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  // Populated field
  user?: User;
}

// Legacy types for backward compatibility
export interface LastMessage {
  content: string;
  timestamp: string;
  senderId: string;
  read: boolean;
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
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
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
  replyToMessageId?: string;
}

// Type definitions
export type ConversationType = "private" | "group";
export type MessageType = "text" | "image" | "file" | "voice";
export type MessageStatus = "sent" | "delivered" | "read";
export type MemberRole = "admin" | "member";

export interface CreateConversationRequest {
  participantIds: string[];
  isGroup?: boolean;
  groupName?: string;
  initialMessage?: string;
}
