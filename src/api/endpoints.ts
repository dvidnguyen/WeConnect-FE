export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/regis',
    VERIFYSEND: '/api/otp/send',
    VERIFYSOTP: '/api/otp/verify',
    LOGOUT: '/auth/logout',
  },
  USER: {
    SEARCH: (query: string) => `/api/users/search?q=${encodeURIComponent(query)}`,
    PROFILE: '/api/users/profile',
    EDIT_PROFILE: '/api/users/edit',
    USER_PROFILE: (userId: string) => `/api/users/profile/${userId}`,
    CHANGE_PASSWORD: '/user/change-password',
    UPLOAD_AVATAR: '/user/upload-avatar',
  },
  CONSERVATION: {
    LIST: '/conservation',
    CREATE: '/conservation/create',
    DELETE: (id: string) => `/conservation/${id}`,
  },
  MESSAGES: {
    LIST: '/messages',
    SEND: '/messages/send',
    DELETE: (id: string) => `/messages/${id}`,
  },
  FRIENDS: {
    LIST: '/friend-request',
    SEND: '/friend-request/send',
    ACCEPT: '/friend-request/accepted',
    REJECT: '/friend-request/rejected',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
  },
};
