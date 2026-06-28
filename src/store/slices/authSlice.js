import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

const getInitialUser = () => {
  const userStr = localStorage.getItem('user') || localStorage.getItem('safeharbor_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing initial user', e);
    }
  }
  return null;
};

const getInitialToken = () => {
  const token = localStorage.getItem('safeharbor_jwt_token');
  if (token) return token;
  const user = getInitialUser();
  return user ? user.accessToken : null;
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || 'Authentication failed';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.registerPersonnel(userData);
      return data;
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: getInitialUser(),
  token: getInitialToken(),
  loading: false,
  error: null,
  isSuccess: false, // For registration redirect
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetRegisterSuccess: (state) => {
      state.isSuccess = false;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.isSuccess = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isSuccess = false;
      });
  },
});

export const { clearAuthError, resetRegisterSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
