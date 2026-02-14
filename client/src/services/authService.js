import api from './api';

const authService = {
    // Register new customer
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Get current user profile
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, passwordData) => {
        const response = await api.put(`/auth/reset-password/${token}`, passwordData);
        return response.data;
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    },
};

export default authService;