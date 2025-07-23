import { createContext } from "react";
import type { Conversation, User } from "../lib/mockData";

export interface MessagesContextType {
  currentUser: User;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
}

// Tạo Context
export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);
