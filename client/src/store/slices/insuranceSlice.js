import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import insuranceService from '../../services/insuranceService';

// ── Renewal Thunks ──
export const submitRenewal = createAsyncThunk(
  'insurance/submitRenewal',
  async (data, { rejectWithValue }) => {
    try {
      const response = await insuranceService.submitRenewal(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit renewal request');
    }
  }
);

export const fetchAllRenewals = createAsyncThunk(
  'insurance/fetchAllRenewals',
  async (params, { rejectWithValue }) => {
    try {
      const response = await insuranceService.getAllRenewals(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch renewals');
    }
  }
);

export const fetchMyRenewals = createAsyncThunk(
  'insurance/fetchMyRenewals',
  async (params, { rejectWithValue }) => {
    try {
      const response = await insuranceService.getMyRenewals(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your renewals');
    }
  }
);

export const approveRenewal = createAsyncThunk(
  'insurance/approveRenewal',
  async ({ id, adminRemarks }, { rejectWithValue }) => {
    try {
      const response = await insuranceService.approveRenewal(id, { adminRemarks });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve renewal');
    }
  }
);

export const rejectRenewal = createAsyncThunk(
  'insurance/rejectRenewal',
  async ({ id, adminRemarks }, { rejectWithValue }) => {
    try {
      const response = await insuranceService.rejectRenewal(id, { adminRemarks });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject renewal');
    }
  }
);

export const sendRenewalReminder = createAsyncThunk(
  'insurance/sendReminder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await insuranceService.sendRenewalReminder(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reminder');
    }
  }
);

// ── Claim Thunks ──
export const submitClaim = createAsyncThunk(
  'insurance/submitClaim',
  async (data, { rejectWithValue }) => {
    try {
      const response = await insuranceService.submitClaim(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit claim');
    }
  }
);

export const fetchAllClaims = createAsyncThunk(
  'insurance/fetchAllClaims',
  async (params, { rejectWithValue }) => {
    try {
      const response = await insuranceService.getAllClaims(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch claims');
    }
  }
);

export const fetchMyClaims = createAsyncThunk(
  'insurance/fetchMyClaims',
  async (params, { rejectWithValue }) => {
    try {
      const response = await insuranceService.getMyClaims(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your claims');
    }
  }
);

export const processClaim = createAsyncThunk(
  'insurance/processClaim',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await insuranceService.processClaim(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process claim');
    }
  }
);

export const fetchClaimStats = createAsyncThunk(
  'insurance/fetchClaimStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await insuranceService.getClaimStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch claim statistics');
    }
  }
);

const initialState = {
  renewals: [],
  myRenewals: [],
  renewalDetail: null,
  claims: [],
  myClaims: [],
  claimDetail: null,
  claimStats: null,
  loading: false,
  btnLoading: false,
  error: null,
  success: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    clearInsuranceStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    resetInsuranceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Submit Renewal
      .addCase(submitRenewal.pending, (state) => {
        state.btnLoading = true;
        state.error = null;
      })
      .addCase(submitRenewal.fulfilled, (state, action) => {
        state.btnLoading = false;
        state.success = action.payload.message;
      })
      .addCase(submitRenewal.rejected, (state, action) => {
        state.btnLoading = false;
        state.error = action.payload;
      })

      // Fetch All Renewals (Admin)
      .addCase(fetchAllRenewals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRenewals.fulfilled, (state, action) => {
        state.loading = false;
        state.renewals = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllRenewals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Renewals (Customer)
      .addCase(fetchMyRenewals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRenewals.fulfilled, (state, action) => {
        state.loading = false;
        state.myRenewals = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyRenewals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Claims (Admin)
      .addCase(fetchAllClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Claims (Customer)
      .addCase(fetchMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.myClaims = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Claim Stats
      .addCase(fetchClaimStats.fulfilled, (state, action) => {
        state.claimStats = action.payload.data.stats;
      })

      // Combined Loading for buttons (Submit Renewal/Claim, Process Renewal/Claim, Remind)
      .addMatcher(
        (action) =>
          [
            submitRenewal.pending,
            submitClaim.pending,
            approveRenewal.pending,
            rejectRenewal.pending,
            processClaim.pending,
            sendRenewalReminder.pending,
          ].includes(action.type),
        (state) => {
          state.btnLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            submitRenewal.fulfilled,
            submitClaim.fulfilled,
            approveRenewal.fulfilled,
            rejectRenewal.fulfilled,
            processClaim.fulfilled,
            sendRenewalReminder.fulfilled,
          ].includes(action.type),
        (state, action) => {
          state.btnLoading = false;
          state.success = action.payload.message;
        }
      )
      .addMatcher(
        (action) =>
          [
            submitRenewal.rejected,
            submitClaim.rejected,
            approveRenewal.rejected,
            rejectRenewal.rejected,
            processClaim.rejected,
            sendRenewalReminder.rejected,
          ].includes(action.type),
        (state, action) => {
          state.btnLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearInsuranceStatus, resetInsuranceState } = insuranceSlice.actions;
export default insuranceSlice.reducer;
