import api from './axios';
import { API_ENDPOINTS } from './endpoints';

// Types for message API (Send/Delete only)
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  files?: File[];
}

export interface SendMessageResponse {
  code: number;
  message: string;
  result: {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    type: 'text' | 'image' | 'file' | 'voice';
    receipt: number;
    reaction: number;
    url: string[];
    urlDownload: string[];
    content: string;
    sentAt: string;
    mine: boolean;
    senderAvatar: string | null;
  };
}

// API Methods
export const messageAPI = {
  // Send a new message
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const formData = new FormData();
    formData.append('conversationId', data.conversationId);
    formData.append('content', data.content);
    formData.append('type', data.type);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await api.post(API_ENDPOINTS.MESSAGES.SEND, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
