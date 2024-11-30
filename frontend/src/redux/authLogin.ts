// src/redux/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  role: 'customer' | 'admin';
};

const initialState: AuthState = {
  role: 'customer',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;