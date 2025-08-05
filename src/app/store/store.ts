import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Thêm các reducer khác ở đây
  },
  devTools: true // Enable Redux DevTools
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
