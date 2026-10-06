import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// ─── Token Validation ────────────────────────────────────────────────────────
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch (e) {
    return false;
  }
};

// ─── Session Guard ────────────────────────────────────────────────────────────
// We use sessionStorage as a "this tab/session was authenticated" flag.
// sessionStorage is cleared when the browser tab is closed (unlike localStorage).
// This ensures: a fresh browser visit always lands on /login first,
// even if there is a valid-looking JWT in localStorage from a previous session.
const SESSION_KEY = 'safeharbor_session_active';
const isSessionActive = () => !!sessionStorage.getItem(SESSION_KEY);
const markSessionActive = () => sessionStorage.setItem(SESSION_KEY, '1');
const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

// ─── Initial State Helpers ────────────────────────────────────────────────────
const getInitialToken = () => {
  // Only restore token if this browser session was previously authenticated.
  // On a fresh page load (new tab, direct URL visit), sessionStorage is empty
  // → we always start unauthenticated and show the login page.
  if (!isSessionActive()) {
    // Don't clear localStorage — the user may want to log back in quickly.
    return null;
  }

  const token = localStorage.getItem('safeharbor_jwt_token');
  if (token && isTokenValid(token)) return token;

  const userStr = localStorage.getItem('safeharbor_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.accessToken && isTokenValid(user.accessToken)) {
        return user.accessToken;
      }
    } catch (e) { /* invalid JSON */ }
  }

  // Token in storage is expired/invalid — clear it and the session flag
  localStorage.removeItem('safeharbor_jwt_token');
  localStorage.removeItem('safeharbor_user');
  clearSession();
  return null;
};

const getInitialUser = () => {
  const token = getInitialToken();
  if (!token) return null;
  const userStr = localStorage.getItem('safeharbor_user');
  if (userStr) {
    try { return JSON.parse(userStr); } catch (e) { /* invalid JSON */ }
  }
  return null;
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.message
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
      const message =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const initialState = {
  user: getInitialUser(),
  token: getInitialToken(),
  loading: false,
  error: null,
  isSuccess: false,
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
      clearSession();
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
        // Mark this browser session as authenticated
        markSessionActive();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.payload;
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
        state.error = action.payload?.message ?? action.payload;
        state.isSuccess = false;
      });
  },
});

export const { clearAuthError, resetRegisterSuccess, logout } = authSlice.actions;
export default authSlice.reducer;