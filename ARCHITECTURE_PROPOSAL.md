# WeConnect - Cấu Trúc Mới Cho Social Platform

## 🎯 Mục tiêu
Tái cấu trúc để mở rộng thành một social media platform hoàn chỉnh với:
- Posts & Feed
- Comments & Reactions
- Messages & Chat
- User Profiles
- Notifications
- Groups/Communities

## 📁 Cấu Trúc Thư Mục Đề Xuất

```
src/
├── app/                        # App configuration & providers
│   ├── providers/              # Global providers
│   │   ├── AppProvider.tsx     # Tổng hợp tất cả providers
│   │   ├── AuthProvider.tsx    # Authentication state
│   │   └── ThemeProvider.tsx   # Theme management
│   ├── store/                  # Global state management (Zustand/Redux)
│   │   ├── auth.store.ts
│   │   ├── posts.store.ts
│   │   └── messages.store.ts
│   └── routes/                 # Route definitions
│       └── AppRoutes.tsx
│
├── features/                   # Feature-based organization
│   ├── auth/                   # Authentication feature
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── SignUpPage.tsx
│   │
│   ├── messages/               # Messages feature
│   │   ├── components/
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── MessageInput.tsx
│   │   ├── hooks/
│   │   │   ├── useMessages.ts
│   │   │   ├── useChat.ts
│   │   │   └── usePagination.ts
│   │   ├── services/
│   │   │   └── messages.service.ts
│   │   ├── types/
│   │   │   └── messages.types.ts
│   │   └── pages/
│   │       └── MessagesPage.tsx
│   │
│   ├── posts/                  # Social posts feature
│   │   ├── components/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostComments.tsx
│   │   │   ├── PostReactions.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   └── PostFeed.tsx
│   │   ├── hooks/
│   │   │   ├── usePosts.ts
│   │   │   ├── useComments.ts
│   │   │   └── useReactions.ts
│   │   ├── services/
│   │   │   ├── posts.service.ts
│   │   │   ├── comments.service.ts
│   │   │   └── reactions.service.ts
│   │   ├── types/
│   │   │   └── posts.types.ts
│   │   └── pages/
│   │       ├── FeedPage.tsx
│   │       └── PostDetailPage.tsx
│   │
│   ├── profiles/               # User profiles feature
│   │   ├── components/
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ProfileTabs.tsx
│   │   │   └── EditProfile.tsx
│   │   ├── hooks/
│   │   │   └── useProfile.ts
│   │   ├── services/
│   │   │   └── profile.service.ts
│   │   ├── types/
│   │   │   └── profile.types.ts
│   │   └── pages/
│   │       └── ProfilePage.tsx
│   │
│   └── notifications/          # Notifications feature
│       ├── components/
│       │   ├── NotificationList.tsx
│       │   └── NotificationItem.tsx
│       ├── hooks/
│       │   └── useNotifications.ts
│       ├── services/
│       │   └── notifications.service.ts
│       ├── types/
│       │   └── notifications.types.ts
│       └── pages/
│           └── NotificationsPage.tsx
│
├── shared/                     # Reusable across features  
│   ├── components/             # Common UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── common/            # Common business components
│   │       ├── Avatar.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/                 # Common hooks
│   │   ├── useApi.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── api.utils.ts
│   │   ├── date.utils.ts
│   │   ├── format.utils.ts
│   │   └── validation.utils.ts
│   │
│   ├── constants/             # App constants
│   │   ├── routes.const.ts
│   │   ├── api.const.ts
│   │   └── config.const.ts
│   │
│   └── types/                 # Shared types
│       ├── api.types.ts
│       ├── common.types.ts
│       └── index.ts
│
├── data/                      # Data layer
│   ├── api/                   # API configuration
│   │   ├── client.ts          # Axios instance
│   │   ├── interceptors.ts    # Request/response interceptors
│   │   └── endpoints.ts       # API endpoints
│   │
│   ├── mock/                  # Mock data (development)
│   │   ├── users.mock.ts
│   │   ├── posts.mock.ts
│   │   └── messages.mock.ts
│   │
│   └── schemas/               # Data validation schemas
│       ├── user.schema.ts
│       ├── post.schema.ts
│       └── message.schema.ts
│
└── assets/                    # Static assets
    ├── images/
    ├── icons/
    └── styles/
        ├── globals.css
        └── components.css
```

## 🔧 Naming Convention & Best Practices

### 1. **Feature-First Organization**
- Mỗi feature độc lập với components, hooks, services riêng
- Dễ maintain và scale
- Team có thể work parallel trên các features khác nhau

### 2. **Naming Convention Chuẩn**
```typescript
// Files
PostCard.tsx (PascalCase cho components)
useMessages.ts (camelCase cho hooks)
posts.service.ts (lowercase với dots)
posts.types.ts (lowercase với dots)

// Components
const PostCard = () => {} // PascalCase
const useMessages = () => {} // camelCase cho hooks

// Services
export const postsService = {} // camelCase

// Types
interface PostData {} // PascalCase
type MessageStatus = {} // PascalCase
```

### 3. **Hooks Organization**
```typescript
// Feature-specific hooks
features/messages/hooks/useMessages.ts
features/posts/hooks/usePosts.ts

// Shared/common hooks  
shared/hooks/useApi.ts
shared/hooks/usePagination.ts
```

### 4. **Service Layer Chuẩn**
```typescript
// Consistent service structure
export const postsService = {
  getPosts: () => {},
  createPost: () => {},
  updatePost: () => {},
  deletePost: () => {},
  // CRUD operations
}

export const messagesService = {
  getConversations: () => {},
  sendMessage: () => {},
  loadMoreMessages: () => {},
  // Feature-specific operations
}
```

## 🚀 Migration Plan

### Phase 1: Setup New Structure
1. Create new folder structure
2. Move existing files to appropriate locations
3. Update imports

### Phase 2: Refactor Features
1. Extract Messages feature → features/messages/
2. Extract Auth → features/auth/  
3. Create shared components

### Phase 3: Add New Features
1. Posts & Feed system
2. Comments & Reactions
3. User Profiles
4. Notifications

## 💡 Benefits

1. **Scalability**: Dễ thêm features mới
2. **Maintainability**: Code tổ chức rõ ràng
3. **Team Collaboration**: Mỗi dev có thể work trên feature riêng
4. **Reusability**: Shared components & hooks
5. **Testing**: Dễ test từng feature độc lập
6. **Performance**: Code splitting by features

## 🎨 Component Examples

### PostCard Component
```typescript
// features/posts/components/PostCard.tsx
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onComment, onShare }: PostCardProps) => {
  return (
    <Card>
      <PostHeader user={post.author} timestamp={post.createdAt} />
      <PostContent content={post.content} media={post.media} />
      <PostReactions 
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
        onLike={() => onLike(post.id)}
        onComment={() => onComment(post.id)}
        onShare={() => onShare(post.id)}
      />
    </Card>
  );
};
```

Cấu trúc này sẽ giúp WeConnect dễ dàng mở rộng thành một social platform hoàn chỉnh! 🎯
