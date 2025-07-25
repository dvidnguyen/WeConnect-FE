import api from './axios';
import type { User } from '@/shared/types';

export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
  nameTag?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export const userApi = {
  // Đăng ký user mới
  register: (data: RegisterUserDTO) =>
    api.post<RegisterResponse>('/api/auth/register', data),

  // Lấy thông tin user hiện tại
  getCurrentUser: () =>
    api.get<User>('/api/users/me'),

  // Cập nhật thông tin user
  updateProfile: (userId: string, data: Partial<User>) =>
    api.put<User>(`/api/users/${userId}`, data),

  // Đổi mật khẩu
  changePassword: (userId: string, oldPassword: string, newPassword: string) =>
    api.put(`/api/users/${userId}/password`, { oldPassword, newPassword }),
};
