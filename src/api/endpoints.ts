export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/regis',
    VERIFYSEND: 'api/otp/send',
    VERIFYSOTP: 'api/otp/verify',
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
