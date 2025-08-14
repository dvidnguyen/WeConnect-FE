import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string | null;
  username: string | null;
  tempEmail: string | null;
}

const initialState: AuthState = {
  email: null,
  username: null,
  tempEmail: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; username: string }>) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },
    logout: (state) => {
      state.email = null;
      state.username = null;
      state.tempEmail = null;
    }
  }
});

export const { setUser, setTempEmail, logout } = authSlice.actions;
export default authSlice.reducer;
