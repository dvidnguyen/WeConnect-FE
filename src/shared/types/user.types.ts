// Shared User types - dùng chung trong toàn bộ app
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastActive?: string;
  timeJoined: string;
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

export type UserStatus = "online" | "offline" | "away";
