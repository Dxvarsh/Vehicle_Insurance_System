import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
        // Future slices:
        // vehicle: vehicleReducer,
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