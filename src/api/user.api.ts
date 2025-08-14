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
  isFriend: boolean;
  isBlocked: boolean;
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

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ code: number; message: string }> => {
    const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
      oldPassword,
      newPassword
    });
    return response.data;
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