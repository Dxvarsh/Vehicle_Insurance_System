import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService from '../../services/customerService';

// ─────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────

// Get all customers (Admin/Staff)
export const fetchAllCustomers = createAsyncThunk(
    'customer/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await customerService.getAllCustomers(params);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch customers'
            );
        }
    }
);

// Get customer stats
export const fetchCustomerStats = createAsyncThunk(
    'customer/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await customerService.getCustomerStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch stats'
            );
        }
    }
);

// Get customer by ID
export const fetchCustomerById = createAsyncThunk(
    'customer/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await customerService.getCustomerById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch customer'
            );
        }
    }
);

// Update customer
export const updateCustomer = createAsyncThunk(
    'customer/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await customerService.updateCustomer(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update customer'
            );
        }
    }
);

// Toggle customer status
export const toggleCustomerStatus = createAsyncThunk(
    'customer/toggleStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await customerService.toggleCustomerStatus(id, isActive);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update status'
            );
        }
    }
);

// Staff register customer
export const staffRegisterCustomer = createAsyncThunk(
    'customer/staffRegister',
    async (data, { rejectWithValue }) => {
        try {
            const response = await customerService.staffRegisterCustomer(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to register customer'
            );
        }
    }
);

// Fetch customer dashboard
export const fetchCustomerDashboard = createAsyncThunk(
    'customer/fetchDashboard',
    async (id, { rejectWithValue }) => {
        try {
            const response = await customerService.getCustomerDashboard(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch dashboard'
            );
        }
    }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

const initialState = {
    // Customer list (Admin/Staff)
    customers: [],
    pagination: null,
    stats: null,

    // Single customer
    selectedCustomer: null,

    // Dashboard
    dashboard: null,

    // Loading states
    isLoading: false,
    isStatsLoading: false,
    isDashboardLoading: false,
    isUpdating: false,

    // Error
    error: null,
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        clearCustomerError: (state) => {
            state.error = null;
        },
        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
        },
        clearDashboard: (state) => {
            state.dashboard = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Fetch All Customers ──
            .addCase(fetchAllCustomers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAllCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ── Fetch Stats ──
            .addCase(fetchCustomerStats.pending, (state) => {
                state.isStatsLoading = true;
            })
            .addCase(fetchCustomerStats.fulfilled, (state, action) => {
                state.isStatsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchCustomerStats.rejected, (state, action) => {
                state.isStatsLoading = false;
                state.error = action.payload;
            })

            // ── Fetch By ID ──
            .addCase(fetchCustomerById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedCustomer = action.payload;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // ── Update Customer ──
            .addCase(updateCustomer.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.selectedCustomer = {
                    ...state.selectedCustomer,
                    customer: action.payload.customer,
                };
                // Update in list too
                const idx = state.customers.findIndex(
                    (c) => c._id === action.payload.customer._id
                );
                if (idx !== -1) {
                    state.customers[idx] = action.payload.customer;
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // ── Toggle Status ──
            .addCase(toggleCustomerStatus.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updated = action.payload.customer;
                const idx = state.customers.findIndex((c) => c._id === updated._id);
                if (idx !== -1) {
                    state.customers[idx].isActive = updated.isActive;
                }
            })
            .addCase(toggleCustomerStatus.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // ── Staff Register ──
            .addCase(staffRegisterCustomer.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(staffRegisterCustomer.fulfilled, (state) => {
                state.isUpdating = false;
            })
            .addCase(staffRegisterCustomer.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // ── Fetch Dashboard ──
            .addCase(fetchCustomerDashboard.pending, (state) => {
                state.isDashboardLoading = true;
                state.error = null;
            })
            .addCase(fetchCustomerDashboard.fulfilled, (state, action) => {
                state.isDashboardLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchCustomerDashboard.rejected, (state, action) => {
                state.isDashboardLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCustomerError, clearSelectedCustomer, clearDashboard } =
    customerSlice.actions;

export const selectCustomers = (state) => state.customer;

export default customerSlice.reducer;