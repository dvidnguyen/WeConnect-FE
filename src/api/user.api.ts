import api from './axios'
import { API_ENDPOINTS } from './endpoints'

// Types - Match với SearchUserResponse từ BE
export interface User {
  userId: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
  createdAt?: string;
  isOnline?: boolean;
  // BE relationship flags từ populateFriendAndBlockFlags
  isFriend?: boolean;  // For some APIs
  friend?: boolean;    // For search API response
  isBlocked?: boolean;
  blocked?: boolean;   // For search API response
}

export interface SearchUsersResponse {
  code: number;
  message: string;
  result: User[];
}

export interface UserProfile {
  email: string;
  username: string;
  avatarUrl?: string | null;
  birthDate?: string | null;
  phone?: string | null;
}

export interface OtherUserProfile {
  userId: string;
  email: string;
  username: string;
  avatarUrl?: string;
  friend: boolean;
  blocked: boolean;
}

export interface OtherUserProfileResponse {
  code: number;
  message?: string;
  result?: OtherUserProfile;
}

export interface UpdateProfileRequest {
  username: string;
  birthDate?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

// API Methods
export const userApi = {
  // Search users by query (email, username, etc.)
  searchUsers: async (query: string): Promise<SearchUsersResponse> => {
    if (!query.trim()) {
      return {
        code: 200,
        message: 'Empty query',
        result: []
      };
    }

    const response = await api.get<SearchUsersResponse>(
      API_ENDPOINTS.USER.SEARCH(query)
    );
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ code: number; message?: string; result?: UserProfile }> => {
    try {
      localStorage.getItem('token');

      const response = await api.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      // Trả về format lỗi theo yêu cầu
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { code?: number; message?: string } } };


        // Kiểm tra HTTP status code
        if (axiosError.response?.status === 401) {
          return {
            code: 401,
            message: "Unauthenticated"
          };
        }

        // Kiểm tra response body có chứa error code không
        if (axiosError.response?.data) {
          const responseData = axiosError.response.data;
          if (responseData.code === 401 || responseData.code === 402) {
            return {
              code: responseData.code,
              message: responseData.message || "Unauthorized"
            };
          }
        }
      }
      // Các lỗi khác
      throw error;
    }
  },

  // Get other user profile by userId
  getUserProfile: async (userId: string): Promise<OtherUserProfileResponse> => {
    try {
      if (!userId.trim()) {
        return {
          code: 400,
          message: 'User ID is required'
        };
      }

      const response = await api.get<OtherUserProfileResponse>(
        API_ENDPOINTS.USER.USER_PROFILE(userId)
      );
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { code?: number; message?: string } } };

        if (axiosError.response?.data) {
          const responseData = axiosError.response.data;
          return {
            code: responseData.code || axiosError.response.status || 500,
            message: responseData.message || "Failed to get user profile"
          };
        }

        // Handle HTTP status codes
        if (axiosError.response?.status === 404) {
          return {
            code: 404,
            message: "User not found"
          };
        }

        if (axiosError.response?.status === 401) {
          return {
            code: 401,
            message: "Unauthorized"
          };
        }
      }

      // Network or other errors
      return {
        code: 500,
        message: "Network error occurred"
      };
    }
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ code: number; message: string; result?: UserProfile }> => {
    try {
      const response = await api.post(API_ENDPOINTS.USER.EDIT_PROFILE, data);
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { code?: number; message?: string } } };

        if (axiosError.response?.data) {
          const responseData = axiosError.response.data;
          // Return error response format from backend
          return {
            code: responseData.code || 500,
            message: responseData.message || "Update failed"
          };
        }
      }
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ code: number; message: string; result: { avatarUrl: string } }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post(API_ENDPOINTS.USER.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default userApi;