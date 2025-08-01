import axios from 'axios';
import { interceptorLoading } from './interceptorLoading';

const api = axios.create({
  // baseURL: 'https://jsonplaceholder.typicode.com, // URL của API khi có server thật
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Cho phép gửi cookie trong request
});

// Thêm interceptor để xử lý request
api.interceptors.request.use(
  (config) => {
    interceptorLoading(true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    interceptorLoading(false);
    return response.data;
  },
  (error) => {
    interceptorLoading(false);
    if (error.response) {
      console.error('API Error:', error.response.data);

      switch (error.response.status) {
        case 401:
          // Unauthorized - có thể đăng xuất người dùng
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
