import type { ReactNode } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};