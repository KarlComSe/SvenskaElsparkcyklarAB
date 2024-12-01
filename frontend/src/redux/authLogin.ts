// src/redux/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  role: 'customer' | 'admin';
  isLoggedIn: boolean,
  token: string
  user: string | null
};

const initialState: AuthState = {
  role: 'customer',
  isLoggedIn: false,
  token: '',
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
    setCurrentUser(state, action) {
      state.user = action.payload;
    },
    setLoggedInOut(state, action) {
        state.isLoggedIn = action.payload
    },
    setToken(state, action) {
        state.token = action.payload
    }
  },
});

export const { setRole, setCurrentUser, setLoggedInOut, setToken } = authSlice.actions;
export default authSlice.reducer;