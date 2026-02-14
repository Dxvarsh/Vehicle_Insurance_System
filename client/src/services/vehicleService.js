import api from './api';

const vehicleService = {
  // Get all vehicles (Admin, Staff)
  getAllVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  // Get customer's own vehicles
  getMyVehicles: async (params = {}) => {
    const response = await api.get('/vehicles/my', { params });
    return response.data;
  },

  // Get vehicle stats (Admin, Staff)
  getVehicleStats: async () => {
    const response = await api.get('/vehicles/stats');
    return response.data;
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Add new vehicle
  addVehicle: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export default vehicleService;