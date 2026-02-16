import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import policyService from '../../services/policyService';

const initialState = {
  policies: [],
  adminPremiums: [],
  myPremiums: [],
  myClaims: [],
  myRenewals: [],
  currentPolicy: null,
  currentClaim: null,
  premiumPreview: null,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async Thunks
export const fetchPolicies = createAsyncThunk(
  'policy/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await policyService.getAllPolicies(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch policies');
    }
  }
);

export const fetchAdminPremiums = createAsyncThunk(
  'policy/fetchAdminPremiums',
  async (params, { rejectWithValue }) => {
    try {
      return await policyService.adminGetAllPremiums(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch premiums');
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'policy/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await policyService.getPolicyById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch policy details');
    }
  }
);

export const calculatePremiumPreview = createAsyncThunk(
  'policy/calculatePreview',
  async (data, { rejectWithValue }) => {
    try {
      return await policyService.calculatePremium(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate premium');
    }
  }
);

export const purchasePolicy = createAsyncThunk(
  'policy/purchase',
  async ({ id, vehicleID }, { rejectWithValue }) => {
    try {
      return await policyService.purchasePolicy(id, vehicleID);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to purchase policy');
    }
  }
);

export const fetchMyPremiums = createAsyncThunk(
  'policy/fetchMyPremiums',
  async (params, { rejectWithValue }) => {
    try {
      return await policyService.getMyPremiums(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your premiums');
    }
  }
);

export const payPremium = createAsyncThunk(
  'policy/payPremium',
  async ({ id, transactionID }, { rejectWithValue }) => {
    try {
      return await policyService.processPayment(id, transactionID);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
  }
);

export const fetchMyClaims = createAsyncThunk(
  'policy/fetchMyClaims',
  async (params, { rejectWithValue }) => {
    try {
      return await policyService.getMyClaims(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your claims');
    }
  }
);

export const submitClaim = createAsyncThunk(
  'policy/submitClaim',
  async (data, { rejectWithValue }) => {
    try {
      return await policyService.submitClaim(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit claim');
    }
  }
);

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    clearPolicyError: (state) => {
      state.error = null;
    },
    clearPremiumPreview: (state) => {
      state.premiumPreview = null;
    },
    resetPolicyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policies = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Admin Premiums
      .addCase(fetchAdminPremiums.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminPremiums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminPremiums = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminPremiums.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Policy By ID
      .addCase(fetchPolicyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPolicy = action.payload.data;
      })
      .addCase(calculatePremiumPreview.fulfilled, (state, action) => {
        state.premiumPreview = action.payload.data;
      })
      // My Premiums
      .addCase(fetchMyPremiums.fulfilled, (state, action) => {
        state.myPremiums = action.payload.data;
      })
      // My Claims
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.myClaims = action.payload.data;
      })
      // Purchase & Submit
      .addMatcher(
        (action) => action.type.endsWith('/pending') && (action.type.includes('purchase') || action.type.includes('submit') || action.type.includes('pay')),
        (state) => {
          state.isSubmitting = true;
        }
      )
      .addMatcher(
        (action) => (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) && (action.type.includes('purchase') || action.type.includes('submit') || action.type.includes('pay')),
        (state) => {
          state.isSubmitting = false;
        }
      );
  },
});

export const { clearPolicyError, clearPremiumPreview, resetPolicyState } = policySlice.actions;

export const selectPolicies = (state) => state.policy;

export default policySlice.reducer;
