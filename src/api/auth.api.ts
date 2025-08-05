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
}

interface UserData {
  email: string
  name: string
  avatar?: string
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<UserData>> => {
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
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFYSEND, { email })
    return response.data
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<ApiResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFYSOTP, payload)
    return response.data
  }
}