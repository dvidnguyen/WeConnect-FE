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
  CONTACT: {
    LIST: '/contact/',
    BLOCK: (id: string) => `/contact/block/${id}`,
    UNBLOCK: (id: string) => `/contact/unblock/${id}`,
    CANCEL: (id: string) => `/contact/cancel/${id}`,
  },
  CONVERSATIONS: {
    CREATE: '/api/conversations/create',
    LIST: `/api/conversations`,
    GET_BY_ID: (id: string) => `/conversations/${id}`,
    // DELETE: (id: string) => `/conversations/${id}`,
    GET_PER_CONSERVATION: (id: string, limit: number = 15, before?: string, after?: string) => {
      let url = `/api/conversations/${id}/messages?limit=${limit}`;
      if (before) url += `&before=${before}`;
      if (after) url += `&after=${after}`;
      return url;
    },
    INVITE: (id: string) => `/api/conversations/${id}/members/invite`,
    LEAVE: (id: string) => `/api/conversations/${id}/leave`,
  },
  MESSAGES: {
    SEND: '/api/message',
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
