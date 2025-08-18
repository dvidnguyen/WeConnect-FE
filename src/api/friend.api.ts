import api from './axios'
import { API_ENDPOINTS } from './endpoints'

export interface Contact {
  id: string
  userId?: string
  username?: string
  fullName?: string
  avatar?: string
  email?: string
  status?: 'online' | 'offline'
  lastActive?: string
  nickName?: string
  name?: string // Added to match API response
  avatarUrl?: string // Added to match API response
  block?: boolean // Added to match API response
}

export interface GetContactsResponse {
  code: number
  message?: string
  result?: Contact[]
}

// Response structure từ GET /weconnect/friend-request
export interface FriendRequestFromAPI {
  id: string
  requesterId: string
  requesterName: string
  sentAt: string
}

// Structure để hiển thị trong UI (transform từ API response)
export interface FriendRequest {
  id: string
  from: {
    userId: string
    username: string
    email?: string
    avatar?: string
  }
  to: {
    userId: string
    username: string
    email?: string
  }
  body: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface SendFriendRequestPayload {
  to: string
  body?: string
}

export interface AcceptRejectFriendRequestPayload {
  id: string
}

export interface FriendRequestResponse {
  code: number
  message?: string
  result?: unknown
}

export interface GetFriendRequestsResponse {
  code: number
  message?: string
  result?: FriendRequestFromAPI[]
}

export const friendApi = {
  // GET /friend-request - Lấy danh sách friend requests nhận được
  getFriendRequests: async (): Promise<GetFriendRequestsResponse> => {
    try {
      const response = await api.get(API_ENDPOINTS.FRIENDS.LIST)
      return response.data
    } catch (error: unknown) {
      console.error('Get friend requests error:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } }
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to get friend requests',
            result: []
          }
        }
      }

      return {
        code: 500,
        message: 'Network error occurred',
        result: []
      }
    }
  },

  // POST /friend-request/send - Gửi friend request
  sendFriendRequest: async (payload: SendFriendRequestPayload): Promise<FriendRequestResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.FRIENDS.SEND, payload)
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } }
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to send friend request'
          }
        }
      }

      return {
        code: 500,
        message: 'Network error occurred'
      }
    }
  },

  // POST /friend-request/accepted - Accept friend request  
  acceptFriendRequest: async (requestId: string): Promise<FriendRequestResponse> => {
    try {
      const payload: AcceptRejectFriendRequestPayload = { id: requestId }
      const response = await api.post(API_ENDPOINTS.FRIENDS.ACCEPT, payload)
      return response.data
    } catch (error: unknown) {
      console.error('Accept friend request error:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } }
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to accept friend request'
          }
        }
      }

      return {
        code: 500,
        message: 'Network error occurred'
      }
    }
  },

  // POST /friend-request/rejected - Reject friend request
  rejectFriendRequest: async (requestId: string): Promise<FriendRequestResponse> => {
    try {
      const payload: AcceptRejectFriendRequestPayload = { id: requestId }
      const response = await api.post(API_ENDPOINTS.FRIENDS.REJECT, payload)
      return response.data
    } catch (error: unknown) {
      console.error('Reject friend request error:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } }
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to reject friend request'
          }
        }
      }

      return {
        code: 500,
        message: 'Network error occurred'
      }
    }
  },

  // GET /contact - Get list of contacts
  getContacts: async (): Promise<GetContactsResponse> => {
    try {
      const response = await api.get(API_ENDPOINTS.CONTACT.LIST)
      return response.data
    } catch (error: unknown) {
      console.error('Get contacts error:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } }
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to get contacts',
            result: []
          }
        }
      }

      return {
        code: 500,
        message: 'Network error occurred',
        result: []
      }
    }
  },

  // DELETE /contact/cancel/:id - Cancel a friend
  cancelFriend: async (id: string): Promise<FriendRequestResponse> => {
    try {
      const response = await api.delete(API_ENDPOINTS.CONTACT.CANCEL(id));
      return response.data;
    } catch (error: unknown) {
      console.error('Cancel friend error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } };
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to cancel friend',
          };
        }
      }

      return {
        code: 500,
        message: 'Network error occurred',
      };
    }
  },
  // POST /contact/block/:id - Block a contact
  blockContact: async (id: string): Promise<FriendRequestResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.CONTACT.BLOCK(id));
      return response.data;
    } catch (error: unknown) {
      console.error('Block contact error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } };
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to block contact',
          };
        }
      }

      return {
        code: 500,
        message: 'Network error occurred',
      };
    }
  },

  // POST /contact/unblock/:id - Unblock a contact
  unblockContact: async (id: string): Promise<FriendRequestResponse> => {
    try {
      const response = await api.delete(API_ENDPOINTS.CONTACT.UNBLOCK(id));
      return response.data;
    } catch (error: unknown) {
      console.error('Unblock contact error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { code?: number; message?: string }; status?: number } };
        if (axiosError.response?.data) {
          return {
            code: axiosError.response.data.code || axiosError.response.status || 500,
            message: axiosError.response.data.message || 'Failed to unblock contact',
          };
        }
      }

      return {
        code: 500,
        message: 'Network error occurred',
      };
    }
  }
}

export default friendApi
