import api from './api';

const policyService = {
  // Policy browsing
  getAllPolicies: async (params) => {
    const response = await api.get('/policies', { params });
    return response.data;
  },

  getPolicyById: async (id) => {
    const response = await api.get(`/policies/${id}`);
    return response.data;
  },

  // Premium calculation
  calculatePremium: async (data) => {
    const response = await api.post('/policies/calculate-premium', data);
    return response.data;
  },

  // Purchase
  purchasePolicy: async (id, vehicleID) => {
    const response = await api.post(`/policies/${id}/purchase`, { vehicleID });
    return response.data;
  },

  // Premium & Payments
  getMyPremiums: async (params) => {
    const response = await api.get('/premiums/my', { params });
    return response.data;
  },

  processPayment: async (id, transactionID) => {
    const response = await api.put(`/premiums/${id}/pay`, { transactionID });
    return response.data;
  },

  // Renewals
  getMyRenewals: async (params) => {
    const response = await api.get('/renewals/my', { params });
    return response.data;
  },

  submitRenewal: async (data) => {
    const response = await api.post('/renewals', data);
    return response.data;
  },

  // Claims
  getMyClaims: async (params) => {
    const response = await api.get('/claims/my', { params });
    return response.data;
  },

  getClaimById: async (id) => {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  submitClaim: async (data) => {
    const response = await api.post('/claims', data);
    return response.data;
  },

  // Admin APIs
  adminCreatePolicy: async (data) => {
    const response = await api.post('/policies', data);
    return response.data;
  },

  adminUpdatePolicy: async (id, data) => {
    const response = await api.put(`/policies/${id}`, data);
    return response.data;
  },

  adminTogglePolicyStatus: async (id) => {
    const response = await api.delete(`/policies/${id}`);
    return response.data;
  },

  adminGetStats: async () => {
    const response = await api.get('/policies/stats');
    return response.data;
  },

  adminGetAllClaims: async (params) => {
    const response = await api.get('/claims', { params });
    return response.data;
  },

  adminUpdateClaimStatus: async (id, action, data) => {
    const response = await api.put(`/claims/${id}/${action}`, data);
    return response.data;
  }
};

export default policyService;
