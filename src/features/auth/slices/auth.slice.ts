import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string | null;
  username: string | null;
}

const initialState: AuthState = {
  email: null,
  username: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; username: string }>) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.email = null;
      state.username = null;
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
