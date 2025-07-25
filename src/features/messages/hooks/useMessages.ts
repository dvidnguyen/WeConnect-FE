import { useContext } from "react";
import { MessagesContext } from "./useMessagesContext";

// Hook để sử dụng context
export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
