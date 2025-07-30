import type { ReactNode } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import { ThemeProvider } from '@/shared/components/ThemeProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};