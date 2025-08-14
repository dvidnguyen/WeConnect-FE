import { API_ENDPOINTS } from './endpoints'
import api from './axios.ts'

interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string  // changed from name
  password: string
  email: string
}

export interface RegisterResponse {
  code: number
  message?: string  // Optional message field
  result: {
    email: string
    valid: boolean
  }
}

interface VerifyOtpPayload {
  email: string
  otp: string
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: number
  result?: any
}

interface VerifyOtpResponse extends ApiResponse {
  code: number
  result: {
    token: string
  }
}

interface UserData {
  email: string
  name: string
  avatar?: string
  token?: string // Thêm token cho login response
}

interface LoginResponse extends ApiResponse<UserData> {
  data: UserData & {
    token: string // Đảm bảo token luôn có trong login response
  }
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    return response.data
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);


      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },

  sendOtp: async (email: string): Promise<ApiResponse> => {
    try {
     

      const response = await api.post(API_ENDPOINTS.AUTH.VERIFYSEND, { email }, {
        timeout: 30000 // Tăng timeout lên 30s cho việc gửi email
      });

     
      return response.data;
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      throw error;
    }
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFYSOTP, payload)
    return response.data
  },
  logout: async (token: string): Promise<VerifyOtpResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT, { token })
    return response.data
  }
}