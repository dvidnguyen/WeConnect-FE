// Mock data for social features (friends, blocked users)
import type { Friend, BlockedUser } from '@/shared/types';
import { mockUsers } from './messages.mock';

// Mock Friends data
export const mockFriends: Friend[] = [
  {
    id: "friend-1",
    requester_id: "550e8400-e29b-41d4-a716-446655440000", // Current user sent request
    addressee_id: "550e8400-e29b-41d4-a716-446655440001",
    status: "accepted",
    created_at: "2025-07-20T10:00:00Z",
    requester: mockUsers[0],
    addressee: mockUsers[1]
  },
  {
    id: "friend-2",
    requester_id: "550e8400-e29b-41d4-a716-446655440002", // Linh sent request to current user
    addressee_id: "550e8400-e29b-41d4-a716-446655440000",
    status: "accepted",
    created_at: "2025-07-15T14:00:00Z",
    requester: mockUsers[2],
    addressee: mockUsers[0]
  },
  {
    id: "friend-3",
    requester_id: "550e8400-e29b-41d4-a716-446655440004", // Mai sent request to current user
    addressee_id: "550e8400-e29b-41d4-a716-446655440000",
    status: "pending",
    created_at: "2025-07-25T09:00:00Z",
    requester: mockUsers[4],
    addressee: mockUsers[0]
  },
  {
    id: "friend-4",
    requester_id: "550e8400-e29b-41d4-a716-446655440000", // Current user sent request
    addressee_id: "550e8400-e29b-41d4-a716-446655440005",
    status: "pending",
    created_at: "2025-07-24T16:30:00Z",
    requester: mockUsers[0],
    addressee: mockUsers[5]
  }
];

// Mock Blocked Users data
export const mockBlockedUsers: BlockedUser[] = [
  {
    id: "blocked-1",
    user_id: "550e8400-e29b-41d4-a716-446655440000", // Current user blocked Duc
    blocked_user_id: "550e8400-e29b-41d4-a716-446655440003",
    blocked_at: "2025-07-23T15:30:00Z",
    blocked_user: mockUsers[3]
  }
];

// Helper functions
export const getFriendsByUserId = (userId: string) =>
  mockFriends.filter(friend =>
    (friend.requester_id === userId || friend.addressee_id === userId) &&
    friend.status === "accepted"
  );

export const getFriendRequestsForUser = (userId: string) =>
  mockFriends.filter(friend =>
    friend.addressee_id === userId &&
    friend.status === "pending"
  );

export const getSentFriendRequests = (userId: string) =>
  mockFriends.filter(friend =>
    friend.requester_id === userId &&
    friend.status === "pending"
  );

export const getBlockedUsersByUserId = (userId: string) =>
  mockBlockedUsers.filter(blocked => blocked.user_id === userId);

export const isFriend = (userId1: string, userId2: string): boolean =>
  mockFriends.some(friend =>
    ((friend.requester_id === userId1 && friend.addressee_id === userId2) ||
      (friend.requester_id === userId2 && friend.addressee_id === userId1)) &&
    friend.status === "accepted"
  );

export const isBlocked = (userId: string, blockedUserId: string): boolean =>
  mockBlockedUsers.some(blocked =>
    blocked.user_id === userId && blocked.blocked_user_id === blockedUserId
  );
