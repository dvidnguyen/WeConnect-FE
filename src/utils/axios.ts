import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
  // baseURL: 'https://api.weconnect.com/v1', // URL của API khi có server thật
  baseURL: '/',  // Hiện tại chỉ dùng mock data nên không cần baseURL cụ thể
  timeout: 10000, // Timeout sau 10s
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Thêm interceptor để xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm token vào header ở đây khi có authentication
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => {
    // Trường hợp response thành công
    return response.data;
  },
  (error) => {
    // Xử lý các lỗi HTTP tại đây
    if (error.response) {
      // Server trả về response với mã lỗi
      console.error('API Error:', error.response.data);

      // Xử lý theo mã lỗi
      switch (error.response.status) {
        case 401:
          // Unauthorized - có thể đăng xuất người dùng
          // logout();
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
      // Request gửi đi nhưng không nhận được response
      console.error('No response received:', error.request);
    } else {
      // Lỗi khi setting up request
      console.error('Request error:', error.message);
    }

    // Trả về rejection để có thể catch ở nơi gọi API
    return Promise.reject(error);
  }
);

export default axiosInstance;
