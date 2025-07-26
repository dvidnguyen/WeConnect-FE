import api from './axios';
import type { Friend, BlockedUser } from '@/shared/types';

export const socialApi = {
  // Friend requests
  sendFriendRequest: (addresseeId: string) =>
    api.post<Friend>('/api/friends/request', { addressee_id: addresseeId }),

  acceptFriendRequest: (friendId: string) =>
    api.put<Friend>(`/api/friends/${friendId}/accept`),

  declineFriendRequest: (friendId: string) =>
    api.put<Friend>(`/api/friends/${friendId}/decline`),

  getFriends: () =>
    api.get<Friend[]>('/api/friends'),

  getFriendRequests: () =>
    api.get<Friend[]>('/api/friends/requests'),

  removeFriend: (friendId: string) =>
    api.delete(`/api/friends/${friendId}`),

  // Blocking
  blockUser: (userId: string) =>
    api.post<BlockedUser>('/api/users/block', { blocked_user_id: userId }),

  unblockUser: (blockedUserId: string) =>
    api.delete(`/api/users/block/${blockedUserId}`),

  getBlockedUsers: () =>
    api.get<BlockedUser[]>('/api/users/blocked'),
};
