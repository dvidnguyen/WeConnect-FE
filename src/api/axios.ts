import axios from 'axios';
import { interceptorLoading } from './interceptorLoading';
import { toast } from 'sonner';

// Khởi tạo axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/weconnect/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Cho phép gửi thông tin kèm cookie trong request
});

// Interceptor cho request - Bật loading
api.interceptors.request.use(
  (config) => {
    // Bật loading indicator khi gửi request
    interceptorLoading(true);

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('❌ [Frontend] No token in localStorage');
    }

    // Trả về config đã chỉnh sửa
    return config;
  },
  (error) => {
    // Xử lý lỗi request
    interceptorLoading(false);
    return Promise.reject(error);
  }
);

// Interceptor cho response - Tắt loading và xử lý message
api.interceptors.response.use(
  (response) => {
    // Tắt loading indicator
    interceptorLoading(false);
    return response;
  },
  (error) => {
    // Tắt loading indicator
    interceptorLoading(false);

    // Hiển thị error message nếu có
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }

    if (error.response?.status === 401) {
      // Handle 401 Unauthorized error - Token expired
      toast.error('Please log in again');

      // Clear token and redirect to login
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0; secure';

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }

    // Log lỗi cho debug
    if (error.response) {
      console.error('API Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
