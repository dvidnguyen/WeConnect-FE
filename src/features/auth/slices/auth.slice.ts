import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    email: string;
    username: string;
  } | null;
  isAuthenticated: boolean;
  tempEmail: string | null; // Chỉ cần lưu email tạm thời
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tempEmail: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegisterResponse: (state, action: PayloadAction<{ code: number, result: { email: string, valid: boolean } }>) => {
      // Chỉ lưu email từ response vào state
      if (action.payload?.result?.email) {
        state.tempEmail = action.payload.result.email;
      }
    },
    clearTempEmail: (state) => {
      state.tempEmail = null;
    },
    setUser: (state, action: PayloadAction<{ email: string; username: string }>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.tempEmail = null;
    }
  }
});

export const { setRegisterResponse, clearTempEmail, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
