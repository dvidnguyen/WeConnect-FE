// Mock data for messages feature  
import type { User } from '@/shared/types';
import type {
  Conversation,
  Message,
  ConversationMember,
  MessageReaction,
  ReadReceipt
} from '@/features/messages/types/messages.types';

// Export re-type for compatibility
export type { User, Conversation, Message, ConversationMember, MessageReaction, ReadReceipt };

// Mock Users
export const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000", // Current user
    email: "you@example.com",
    username: "you_user",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    status: "online",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-07-25T12:00:00Z",
    name: "Bạn",
    nameTag: "you_tag"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "nam@example.com",
    username: "hoang_nam",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
    status: "online",
    created_at: "2024-02-15T09:00:00Z",
    updated_at: "2025-07-25T10:30:00Z",
    name: "Nguyễn Hoàng Nam",
    lastActive: "2025-07-25T10:30:00",
    nameTag: "hoang_nam"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "linh@example.com",
    username: "thuy_linh",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
    status: "away",
    created_at: "2024-03-20T14:30:00Z",
    updated_at: "2025-07-25T08:15:00Z",
    name: "Trần Thủy Linh",
    lastActive: "2025-07-25T08:15:00",
    nameTag: "thuy_linh"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "duc@example.com",
    username: "minh_duc",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duc",
    status: "offline",
    created_at: "2024-04-10T11:20:00Z",
    updated_at: "2025-07-24T22:45:00Z",
    name: "Lê Minh Đức",
    lastActive: "2025-07-24T22:45:00",
    nameTag: "minh_duc"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "mai@example.com",
    username: "thu_mai",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai",
    status: "online",
    created_at: "2024-05-05T16:45:00Z",
    updated_at: "2025-07-25T11:00:00Z",
    name: "Phạm Thu Mai",
    lastActive: "2025-07-25T11:00:00",
    nameTag: "thu_mai"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    email: "tuan@example.com",
    username: "anh_tuan",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
    status: "away",
    created_at: "2024-06-12T13:15:00Z",
    updated_at: "2025-07-25T09:30:00Z",
    name: "Vũ Anh Tuấn",
    lastActive: "2025-07-25T09:30:00",
    nameTag: "anh_tuan"
  }
];

// Mock Conversations với cấu trúc mới theo ERD
export const mockConversations: Conversation[] = [
  // Private conversation 1-1 #1
  {
    id: "conv-1",
    type: "private",
    created_by: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2025-07-20T10:00:00Z",
    creator: mockUsers[0],
    members: [
      {
        id: "member-1-1",
        conversation_id: "conv-1",
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        role: "member",
        joined_at: "2025-07-20T10:00:00Z",
        user: mockUsers[0]
      },
      {
        id: "member-1-2",
        conversation_id: "conv-1",
        user_id: "550e8400-e29b-41d4-a716-446655440001",
        role: "member",
        joined_at: "2025-07-20T10:00:00Z",
        user: mockUsers[1]
      }
    ],
    lastMessage: {
      id: "msg-1-2",
      conversation_id: "conv-1",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Có chứ, để mình gửi cho nhé!",
      status: "read",
      timestamp: "2025-07-22T08:32:00Z",
      sender: mockUsers[0]
    },
    unreadCount: 0
  },

  // Private conversation 1-1 #2
  {
    id: "conv-2",
    type: "private",
    created_by: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2025-07-15T14:20:00Z",
    creator: mockUsers[2],
    members: [
      {
        id: "member-2-1",
        conversation_id: "conv-2",
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        role: "member",
        joined_at: "2025-07-15T14:20:00Z",
        user: mockUsers[0]
      },
      {
        id: "member-2-2",
        conversation_id: "conv-2",
        user_id: "550e8400-e29b-41d4-a716-446655440002",
        role: "member",
        joined_at: "2025-07-15T14:20:00Z",
        user: mockUsers[2]
      }
    ],
    lastMessage: {
      id: "msg-2-2",
      conversation_id: "conv-2",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Chưa, có hay không? 🤔",
      status: "sent",
      timestamp: "2025-07-23T19:18:00Z",
      sender: mockUsers[0]
    },
    unreadCount: 1
  },

  // Private conversation 1-1 #3
  {
    id: "conv-3",
    type: "private",
    created_by: "550e8400-e29b-41d4-a716-446655440000",
    created_at: "2025-07-24T20:45:00Z",
    creator: mockUsers[0],
    members: [
      {
        id: "member-3-1",
        conversation_id: "conv-3",
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        role: "member",
        joined_at: "2025-07-24T20:45:00Z",
        user: mockUsers[0]
      },
      {
        id: "member-3-2",
        conversation_id: "conv-3",
        user_id: "550e8400-e29b-41d4-a716-446655440003",
        role: "member",
        joined_at: "2025-07-24T20:45:00Z",
        user: mockUsers[3]
      }
    ],
    lastMessage: {
      id: "msg-3-1",
      conversation_id: "conv-3",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Tối qua bạn có xem trận đấu không?",
      status: "delivered",
      timestamp: "2025-07-24T21:00:00Z",
      sender: mockUsers[0]
    },
    unreadCount: 0
  },

  // Group conversation
  {
    id: "conv-group-1",
    type: "group",
    name: "Nhóm Dự Án",
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2025-07-20T08:00:00Z",
    creator: mockUsers[1],
    members: [
      {
        id: "member-g1-1",
        conversation_id: "conv-group-1",
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        role: "member",
        joined_at: "2025-07-20T08:00:00Z",
        user: mockUsers[0]
      },
      {
        id: "member-g1-2",
        conversation_id: "conv-group-1",
        user_id: "550e8400-e29b-41d4-a716-446655440001",
        role: "admin",
        joined_at: "2025-07-20T08:00:00Z",
        user: mockUsers[1]
      },
      {
        id: "member-g1-3",
        conversation_id: "conv-group-1",
        user_id: "550e8400-e29b-41d4-a716-446655440002",
        role: "member",
        joined_at: "2025-07-20T08:05:00Z",
        user: mockUsers[2]
      },
      {
        id: "member-g1-4",
        conversation_id: "conv-group-1",
        user_id: "550e8400-e29b-41d4-a716-446655440003",
        role: "member",
        joined_at: "2025-07-20T08:10:00Z",
        user: mockUsers[3]
      }
    ],
    lastMessage: {
      id: "msg-g1-1",
      conversation_id: "conv-group-1",
      sender_id: "550e8400-e29b-41d4-a716-446655440001",
      type: "text",
      content: "Nhóm mình họp lúc 2h chiều nhé!",
      status: "read",
      timestamp: "2025-07-25T11:30:00Z",
      sender: mockUsers[1]
    },
    unreadCount: 0
  }
];

// Mock Messages cho từng conversation
export const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversation_id: "conv-1",
      sender_id: "550e8400-e29b-41d4-a716-446655440001",
      type: "text",
      content: "Bạn còn giữ slide buổi thuyết trình hôm trước không?",
      status: "read",
      timestamp: "2025-07-22T08:30:00Z",
      sender: mockUsers[1]
    },
    {
      id: "msg-1-2",
      conversation_id: "conv-1",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Có chứ, để mình gửi cho nhé!",
      status: "read",
      timestamp: "2025-07-22T08:32:00Z",
      sender: mockUsers[0]
    }
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversation_id: "conv-2",
      sender_id: "550e8400-e29b-41d4-a716-446655440002",
      type: "text",
      content: "Bạn thấy movie mới ra rạp hôm qua chưa?",
      status: "read",
      timestamp: "2025-07-23T19:15:00Z",
      sender: mockUsers[2]
    },
    {
      id: "msg-2-2",
      conversation_id: "conv-2",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Chưa, có hay không? 🤔",
      status: "sent",
      timestamp: "2025-07-23T19:18:00Z",
      sender: mockUsers[0]
    }
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      conversation_id: "conv-3",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      type: "text",
      content: "Tối qua bạn có xem trận đấu không?",
      status: "delivered",
      timestamp: "2025-07-24T21:00:00Z",
      sender: mockUsers[0]
    }
  ],
  "conv-group-1": [
    {
      id: "msg-g1-1",
      conversation_id: "conv-group-1",
      sender_id: "550e8400-e29b-41d4-a716-446655440001",
      type: "text",
      content: "Nhóm mình họp lúc 2h chiều nhé!",
      status: "read",
      timestamp: "2025-07-25T11:30:00Z",
      sender: mockUsers[1],
      reactions: [
        {
          id: "reaction-1",
          message_id: "msg-g1-1",
          user_id: "550e8400-e29b-41d4-a716-446655440000",
          emoji: "👍",
          reacted_at: "2025-07-25T11:31:00Z",
          user: mockUsers[0]
        },
        {
          id: "reaction-2",
          message_id: "msg-g1-1",
          user_id: "550e8400-e29b-41d4-a716-446655440002",
          emoji: "👍",
          reacted_at: "2025-07-25T11:32:00Z",
          user: mockUsers[2]
        }
      ],
      readReceipts: [
        {
          id: "read-1",
          message_id: "msg-g1-1",
          user_id: "550e8400-e29b-41d4-a716-446655440000",
          read_at: "2025-07-25T11:31:00Z",
          user: mockUsers[0]
        },
        {
          id: "read-2",
          message_id: "msg-g1-1",
          user_id: "550e8400-e29b-41d4-a716-446655440002",
          read_at: "2025-07-25T11:32:00Z",
          user: mockUsers[2]
        }
      ]
    }
  ]
};

// Helper functions
export const getCurrentUser = () => mockUsers[0];

export const getConversationById = (id: string) =>
  mockConversations.find(conv => conv.id === id);

export const getUserById = (id: string) =>
  mockUsers.find(user => user.id === id);

export const getMessagesByConversationId = (conversationId: string) =>
  mockMessages[conversationId] || [];

// Helper to get private conversations (1-1)
export const getPrivateConversations = () =>
  mockConversations.filter(conv => conv.type === "private");

// Helper to get group conversations
export const getGroupConversations = () =>
  mockConversations.filter(conv => conv.type === "group");

// Helper to find conversation between two users
export const findPrivateConversation = (userId1: string, userId2: string) =>
  mockConversations.find(conv =>
    conv.type === "private" &&
    conv.members?.some(m => m.user_id === userId1) &&
    conv.members?.some(m => m.user_id === userId2)
  );
