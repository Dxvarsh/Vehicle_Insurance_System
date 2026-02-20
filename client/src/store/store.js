import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import vehicleReducer from './slices/vehicleSlice';
import policyReducer from './slices/policySlice';
import insuranceReducer from './slices/insuranceSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
        vehicle: vehicleReducer,
        policy: policyReducer,
        insurance: insuranceReducer,
        // Future slices:
        // policy: policyReducer,
        // premium: premiumReducer,
        // renewal: renewalReducer,
        // claim: claimReducer,
        // notification: notificationReducer,
        // dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setUser'],
            },
        }),
    devTools: import.meta.env.DEV,
});

export default store;