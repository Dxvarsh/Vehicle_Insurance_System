// API Base URL
export const API_BASE_URL = '/api';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

// User Roles
export const ROLES = {
    ADMIN: 'Admin',
    STAFF: 'Staff',
    CUSTOMER: 'Customer',
};

// Route Paths
export const ROUTES = {
    // Public
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',

    // Customer
    CUSTOMER_DASHBOARD: '/dashboard',
    PROFILE: '/profile',

    // Vehicles
    VEHICLES: '/vehicles',
    ADD_VEHICLE: '/vehicles/add',

    // Policies
    POLICIES: '/policies',
    POLICY_DETAIL: '/policies/:id',
    PURCHASE_POLICY: '/policies/:id/purchase',

    // Premiums
    PREMIUMS: '/premiums',
    PAYMENT: '/premiums/:id/pay',

    // Renewals
    RENEWALS: '/renewals',
    RENEWAL_REQUEST: '/renewals/new',

    // Claims
    CLAIMS: '/claims',
    SUBMIT_CLAIM: '/claims/new',
    CLAIM_DETAIL: '/claims/:id',

    // Notifications
    NOTIFICATIONS: '/notifications',

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    MANAGE_USERS: '/admin/users',
    MANAGE_POLICIES: '/admin/policies',
    MANAGE_CLAIMS: '/admin/claims',
    MANAGE_RENEWALS: '/admin/renewals',
    REPORTS: '/admin/reports',

    // Staff
    STAFF_DASHBOARD: '/staff/dashboard',
};

// Validation Patterns
export const PATTERNS = {
    EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    PHONE: /^\d{10}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    VEHICLE_NUMBER: /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,}$/,
};

// Validation Messages
export const MESSAGES = {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Phone number must be exactly 10 digits',
    INVALID_PASSWORD:
        'Password must be at least 8 characters with uppercase, lowercase, and number',
    PASSWORDS_NOT_MATCH: 'Passwords do not match',
    INVALID_USERNAME:
        'Username must be at least 3 characters (letters, numbers, underscores)',
    MIN_NAME: 'Name must be at least 2 characters',
    INVALID_VEHICLE: 'Enter valid format (e.g., KA01AB1234)',
};