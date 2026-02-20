import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchCharts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getChartData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
    }
  }
);

export const fetchReportData = createAsyncThunk(
  'dashboard/fetchReports',
  async (type, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getReports(type);
      return { type, data: response.data.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report data');
    }
  }
);

const initialState = {
  stats: null,
  charts: {
    policyDistribution: [],
    monthlyPremiums: [],
    claimBreakdown: [],
  },
  reports: {
    policies: [],
    premiums: [],
    claims: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Charts
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.charts = action.payload.data;
      })

      // Reports
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reports[action.payload.type] = action.payload.data;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
