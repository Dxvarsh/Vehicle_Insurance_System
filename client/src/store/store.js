import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import vehicleReducer from './slices/vehicleSlice';
import policyReducer from './slices/policySlice';
import insuranceReducer from './slices/insuranceSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
        vehicle: vehicleReducer,
        policy: policyReducer,
        insurance: insuranceReducer,
        notification: notificationReducer,
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