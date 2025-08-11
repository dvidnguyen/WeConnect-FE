import type { ReactNode } from 'react';
import { Toaster } from '@/shared/components/ui/sonner';
import { ThemeProvider } from '@/shared/components/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '@/app/store/store';
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <div className="flex min-h-screen">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};