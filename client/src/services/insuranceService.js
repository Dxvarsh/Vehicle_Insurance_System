import api from './api';

const insuranceService = {
  // ── Premium APIs ──
  getAllPremiums: (params) => api.get('/premiums', { params }),
  getMyPremiums: (params) => api.get('/premiums/my', { params }),
  getPremiumById: (id) => api.get(`/premiums/${id}`),
  calculatePremium: (data) => api.post('/premiums/calculate', data),
  payPremium: (id, data) => api.put(`/premiums/${id}/pay`, data),

  // ── Renewal APIs ──
  submitRenewal: (data) => api.post('/renewals', data),
  getAllRenewals: (params) => api.get('/renewals', { params }),
  getMyRenewals: (params) => api.get('/renewals/my', { params }),
  getExpiringRenewals: (params) => api.get('/renewals/expiring', { params }),
  getRenewalById: (id) => api.get(`/renewals/${id}`),
  approveRenewal: (id, data) => api.put(`/renewals/${id}/approve`, data),
  rejectRenewal: (id, data) => api.put(`/renewals/${id}/reject`, data),
  sendRenewalReminder: (id) => api.post(`/renewals/${id}/remind`),
  markExpiredPolicies: () => api.put('/renewals/mark-expired'),

  // ── Claim APIs ──
  submitClaim: (data) => api.post('/claims', data),
  getAllClaims: (params) => api.get('/claims', { params }),
  getMyClaims: (params) => api.get('/claims/my', { params }),
  getClaimById: (id) => api.get(`/claims/${id}`),
  processClaim: (id, data) => api.put(`/claims/${id}/process`, data),
  getClaimStats: () => api.get('/claims/stats'),
};

export default insuranceService;
