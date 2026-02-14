import clsx from 'clsx';

/**
 * Merge class names conditionally
 */
export const cn = (...classes) => clsx(...classes);

/**
 * Get initials from name
 */
export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Format currency (Indian Rupee)
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
};

/**
 * Get role-based dashboard route
 */
export const getDashboardRoute = (role) => {
    switch (role) {
        case 'Admin':
            return '/admin/dashboard';
        case 'Staff':
            return '/staff/dashboard';
        case 'Customer':
            return '/dashboard';
        default:
            return '/login';
    }
};

/**
 * Store token in localStorage
 */
export const setToken = (token) => {
    localStorage.setItem('accessToken', token);
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
    return localStorage.getItem('accessToken');
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('accessToken');
};