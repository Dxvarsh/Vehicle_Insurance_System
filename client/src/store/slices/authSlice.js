import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { setToken, removeToken, getToken } from '../../utils/helpers';

// ─────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────

// Register
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            if (response.data?.accessToken) {
                setToken(response.data.accessToken);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            if (response.data?.accessToken) {
                setToken(response.data.accessToken);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            removeToken();
            return null;
        } catch (error) {
            removeToken();
            return rejectWithValue(
                error.response?.data?.message || 'Logout failed'
            );
        }
    }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const token = getToken();
            if (!token) {
                return rejectWithValue('No token found');
            }
            const response = await authService.getMe();
            return response.data;
        } catch (error) {
            removeToken();
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            );
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send reset email'
            );
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, passwordData }, { rejectWithValue }) => {
        try {
            const response = await authService.resetPassword(token, passwordData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Password reset failed'
            );
        }
    }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

const initialState = {
    user: null,
    customer: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false, // App initialization check
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
        // Clear success message
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        // Reset auth state
        resetAuth: () => initialState,
    },
    extraReducers: (builder) => {
        // ── Register ──
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.customer = action.payload.customer;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ── Login ──
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.customer = action.payload.customer;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ── Logout ──
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.customer = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.customer = null;
            })

            // ── Get Current User ──
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true;
                state.user = action.payload.user;
                state.customer = action.payload.customer;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isInitialized = true;
                state.user = null;
                state.customer = null;
            })

            // ── Forgot Password ──
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ── Reset Password ──
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccessMessage, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;