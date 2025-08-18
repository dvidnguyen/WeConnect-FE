import api from './axios'
import { API_ENDPOINTS } from './endpoints'

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
  }
}

export default friendApi
