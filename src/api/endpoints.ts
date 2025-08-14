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
    LIST: '/friends',
    REQUEST: '/friends/request',
    ACCEPT: (id: string) => `/friends/accept/${id}`,
    REJECT: (id: string) => `/friends/reject/${id}`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
  },
};
