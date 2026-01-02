import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  role: string;
  // other user properties
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

export default authSlice.reducer;
