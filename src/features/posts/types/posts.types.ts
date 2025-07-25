// Posts feature types
import type { User, Attachment, PaginationParams } from '@/shared/types';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  visibility: 'public' | 'friends' | 'private';
  tags?: string[];
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLiked: boolean;
  parentCommentId?: string; // For nested comments
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  userId: string;
  targetId: string; // postId or commentId
  targetType: 'post' | 'comment';
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
  createdAt: string;
}

export interface CreatePostRequest {
  content: string;
  attachments?: File[];
  visibility: 'public' | 'friends' | 'private';
  tags?: string[];
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface UpdatePostRequest {
  postId: string;
  content?: string;
  visibility?: 'public' | 'friends' | 'private';
  tags?: string[];
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface PostsPaginationOptions extends PaginationParams {
  userId?: string;
  tag?: string;
  visibility?: 'public' | 'friends' | 'private';
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface PostInteractions {
  toggleLike: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  sharePost: (postId: string, message?: string) => Promise<void>;
  reportPost: (postId: string, reason: string) => Promise<void>;
}
