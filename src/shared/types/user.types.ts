// Shared User types - dùng chung trong toàn bộ app
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  status: "online" | "offline" | "away";
  created_at: string;
  updated_at: string;
  // Optional fields for frontend display
  name?: string; // Display name derived from username
  lastActive?: string;
  nameTag?: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  coverImage?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

// Auth & Session types
export interface VerifyCode {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  jwt_token: string;
  created_at: string;
  expires_at: string;
}

// Social types
export interface Friend {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  created_at: string;
  // Populated fields
  requester?: User;
  addressee?: User;
}

export interface BlockedUser {
  id: string;
  user_id: string;
  blocked_user_id: string;
  blocked_at: string;
  // Populated field
  blocked_user?: User;
}

export type UserStatus = "online" | "offline" | "away";
export type FriendStatus = "pending" | "accepted" | "declined" | "blocked";
