import api from './api';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getChartData: () => api.get('/dashboard/charts'),
  getReports: (type) => api.get(`/dashboard/reports?type=${type}`),
};

export default dashboardService;
