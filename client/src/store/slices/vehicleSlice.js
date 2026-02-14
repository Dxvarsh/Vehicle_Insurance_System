import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vehicleService from '../../services/vehicleService';

// ─────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────

// Get all vehicles (Admin/Staff)
export const fetchAllVehicles = createAsyncThunk(
  'vehicle/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getAllVehicles(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch vehicles'
      );
    }
  }
);

// Get customer's vehicles
export const fetchMyVehicles = createAsyncThunk(
  'vehicle/fetchMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getMyVehicles(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch vehicles'
      );
    }
  }
);

// Get vehicle stats
export const fetchVehicleStats = createAsyncThunk(
  'vehicle/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getVehicleStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

// Get vehicle by ID
export const fetchVehicleById = createAsyncThunk(
  'vehicle/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getVehicleById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch vehicle'
      );
    }
  }
);

// Add vehicle
export const addVehicle = createAsyncThunk(
  'vehicle/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await vehicleService.addVehicle(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add vehicle'
      );
    }
  }
);

// Update vehicle
export const updateVehicle = createAsyncThunk(
  'vehicle/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vehicleService.updateVehicle(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update vehicle'
      );
    }
  }
);

// Delete vehicle
export const deleteVehicle = createAsyncThunk(
  'vehicle/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehicleService.deleteVehicle(id);
      return { ...response.data, deletedId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete vehicle'
      );
    }
  }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

const initialState = {
  vehicles: [],
  pagination: null,
  stats: null,
  selectedVehicle: null,
  isLoading: false,
  isStatsLoading: false,
  isSubmitting: false,
  error: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    clearVehicleError: (state) => {
      state.error = null;
    },
    clearSelectedVehicle: (state) => {
      state.selectedVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All Vehicles ──
      .addCase(fetchAllVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Fetch My Vehicles ──
      .addCase(fetchMyVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Fetch Stats ──
      .addCase(fetchVehicleStats.pending, (state) => {
        state.isStatsLoading = true;
      })
      .addCase(fetchVehicleStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchVehicleStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.error = action.payload;
      })

      // ── Fetch By ID ──
      .addCase(fetchVehicleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Add Vehicle ──
      .addCase(addVehicle.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addVehicle.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // ── Update Vehicle ──
      .addCase(updateVehicle.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updated = action.payload.vehicle;
        const idx = state.vehicles.findIndex((v) => v._id === updated._id);
        if (idx !== -1) {
          state.vehicles[idx] = updated;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // ── Delete Vehicle ──
      .addCase(deleteVehicle.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.vehicles = state.vehicles.filter(
          (v) => v._id !== action.payload.deletedId
        );
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearVehicleError, clearSelectedVehicle } = vehicleSlice.actions;

export const selectVehicles = (state) => state.vehicle;

export default vehicleSlice.reducer;