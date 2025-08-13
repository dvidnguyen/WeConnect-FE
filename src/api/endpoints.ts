export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/regis',
    VERIFYSEND: 'api/otp/send',
    VERIFYSOTP: 'api/otp/verify',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update-profile',
    CHANGE_PASSWORD: '/user/change-password',
    UPLOAD_AVATAR: '/user/upload-avatar',
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
