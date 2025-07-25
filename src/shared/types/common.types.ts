// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Common attachment types
export interface BaseAttachment {
  id: string;
  type: "image" | "file" | "voice" | "video" | "location";
  url: string;
  name?: string;
  size?: string;
  uploadedAt: string;
}

export interface MediaAttachment extends BaseAttachment {
  type: "image" | "video";
  previewUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface FileAttachment extends BaseAttachment {
  type: "file";
  mimeType: string;
}

export interface VoiceAttachment extends BaseAttachment {
  type: "voice";
  duration?: string;
  waveform?: number[];
}

export interface LocationAttachment extends BaseAttachment {
  type: "location";
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
}

export type Attachment = MediaAttachment | FileAttachment | VoiceAttachment | LocationAttachment;
