import api from './api';

const customerService = {
    // Get all customers (Admin, Staff)
    getAllCustomers: async (params = {}) => {
        const response = await api.get('/customers', { params });
        return response.data;
    },

    // Get customer stats (Admin, Staff)
    getCustomerStats: async () => {
        const response = await api.get('/customers/stats');
        return response.data;
    },

    // Get customer by ID
    getCustomerById: async (id) => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    // Update customer profile
    updateCustomer: async (id, data) => {
        const response = await api.put(`/customers/${id}`, data);
        return response.data;
    },

    // Toggle customer status (Admin)
    toggleCustomerStatus: async (id, isActive) => {
        const response = await api.delete(`/customers/${id}`, {
            data: { isActive },
        });
        return response.data;
    },

    // Staff register customer
    staffRegisterCustomer: async (data) => {
        const response = await api.post('/customers/register', data);
        return response.data;
    },

    // Get customer dashboard
    getCustomerDashboard: async (id) => {
        const response = await api.get(`/customers/${id}/dashboard`);
        return response.data;
    },
};

export default customerService;