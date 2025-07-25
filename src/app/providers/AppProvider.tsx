import type { ReactNode } from 'react';
import { MessagesProvider } from '@/features/messages/hooks/useMessagesProvider';
import { Toaster } from '@/shared/components/ui/sonner';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * App Provider - Tổng hợp tất cả providers của ứng dụng
 * Quản lý global state và context providers
 */
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      {/* Messages Provider cho messaging features */}
      <MessagesProvider>
        {children}
      </MessagesProvider>

      {/* Global Toaster cho notifications */}
      <Toaster />
    </>
  );
};
