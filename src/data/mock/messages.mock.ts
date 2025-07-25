// Mock data for messages feature  
import type { User } from '@/shared/types';
import type { Conversation } from '@/features/messages/types/messages.types';

// Export re-type for compatibility
export type { User, Conversation };

// Mock Users
export const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000", // Current user
    email: "you@example.com",
    name: "Bạn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    status: "online",
    timeJoined: "2024-01-01T00:00:00",
    nameTag: "you_tag"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "nam@example.com",
    name: "Nguyễn Hoàng Nam",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
    status: "online",
    lastActive: "2025-07-25T10:30:00",
    timeJoined: "2024-02-15T09:00:00",
    nameTag: "hoang_nam"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "linh@example.com",
    name: "Trần Thủy Linh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
    status: "away",
    lastActive: "2025-07-25T08:15:00",
    timeJoined: "2024-03-20T14:30:00",
    nameTag: "thuy_linh"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "duc@example.com",
    name: "Lê Minh Đức",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duc",
    status: "offline",
    lastActive: "2025-07-24T22:45:00",
    timeJoined: "2024-04-10T11:20:00",
    nameTag: "minh_duc"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "mai@example.com",
    name: "Phạm Thu Mai",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai",
    status: "online",
    lastActive: "2025-07-25T11:00:00",
    timeJoined: "2024-05-05T16:45:00",
    nameTag: "thu_mai"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    email: "tuan@example.com",
    name: "Vũ Anh Tuấn",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
    status: "away",
    lastActive: "2025-07-25T09:30:00",
    timeJoined: "2024-06-12T13:15:00",
    nameTag: "anh_tuan"
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440001",
        content: "Bạn còn giữ slide buổi thuyết trình hôm trước không?",
        timestamp: "2025-07-22T08:30:00",
        read: true
      },
      {
        id: 2,
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        content: "Có chứ, để mình gửi cho nhé!",
        timestamp: "2025-07-22T08:32:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Có chứ, để mình gửi cho nhé!",
      timestamp: "2025-07-22T08:32:00",
      senderId: "550e8400-e29b-41d4-a716-446655440000",
      read: true
    },
    unreadCount: 0,
    isGroup: false,
    createdAt: "2025-07-20T10:00:00",
    updatedAt: "2025-07-22T08:32:00"
  },
  {
    id: "conv-2",
    participants: [mockUsers[0], mockUsers[2]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440002",
        content: "Bạn thấy movie mới ra rạp hôm qua chưa?",
        timestamp: "2025-07-23T19:15:00",
        read: true
      },
      {
        id: 2,
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        content: "Chưa, có hay không? 🤔",
        timestamp: "2025-07-23T19:18:00",
        read: false
      }
    ],
    lastMessage: {
      content: "Chưa, có hay không? 🤔",
      timestamp: "2025-07-23T19:18:00",
      senderId: "550e8400-e29b-41d4-a716-446655440000",
      read: false
    },
    unreadCount: 1,
    isGroup: false,
    createdAt: "2025-07-15T14:20:00",
    updatedAt: "2025-07-23T19:18:00"
  },
  {
    id: "conv-3",
    participants: [mockUsers[0], mockUsers[3]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440000",
        content: "Tối qua bạn có xem trận đấu không?",
        timestamp: "2025-07-24T21:00:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Tối qua bạn có xem trận đấu không?",
      timestamp: "2025-07-24T21:00:00",
      senderId: "550e8400-e29b-41d4-a716-446655440000",
      read: true
    },
    unreadCount: 0,
    isGroup: false,
    createdAt: "2025-07-24T20:45:00",
    updatedAt: "2025-07-24T21:00:00"
  },
  {
    id: "conv-4",
    participants: [mockUsers[0], mockUsers[4]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440004",
        content: "Bạn có rảnh chiều mai không? Mình muốn hỏi về project.",
        timestamp: "2025-07-25T10:45:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Bạn có rảnh chiều mai không? Mình muốn hỏi về project.",
      timestamp: "2025-07-25T10:45:00",
      senderId: "550e8400-e29b-41d4-a716-446655440004",
      read: true
    },
    unreadCount: 2,
    isGroup: false,
    createdAt: "2025-07-25T10:45:00",
    updatedAt: "2025-07-25T10:45:00"
  },
  {
    id: "conv-5",
    participants: [mockUsers[0], mockUsers[5]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440005",
        content: "Code demo đã chạy được chưa bạn?",
        timestamp: "2025-07-25T09:20:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Code demo đã chạy được chưa bạn?",
      timestamp: "2025-07-25T09:20:00",
      senderId: "550e8400-e29b-41d4-a716-446655440005",
      read: true
    },
    unreadCount: 0,
    isGroup: false,
    createdAt: "2025-07-25T09:20:00",
    updatedAt: "2025-07-25T09:20:00"
  },
  {
    id: "conv-6",
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    messages: [
      {
        id: 1,
        senderId: "550e8400-e29b-41d4-a716-446655440001",
        content: "Nhóm mình họp lúc 2h chiều nhé!",
        timestamp: "2025-07-25T11:30:00",
        read: true
      }
    ],
    lastMessage: {
      content: "Nhóm mình họp lúc 2h chiều nhé!",
      timestamp: "2025-07-25T11:30:00",
      senderId: "550e8400-e29b-41d4-a716-446655440001",
      read: true
    },
    unreadCount: 0,
    isGroup: true,
    groupName: "Nhóm Dự Án",
    groupAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=group",
    createdAt: "2025-07-20T08:00:00",
    updatedAt: "2025-07-25T11:30:00"
  }
];

// Helper to get current user
export const getCurrentUser = () => mockUsers[0];

// Helper to get conversation by ID
export const getConversationById = (id: string) =>
  mockConversations.find(conv => conv.id === id);

// Helper to get user by ID  
export const getUserById = (id: string) =>
  mockUsers.find(user => user.id === id);
