import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Placeholder pages (will be built in future iterations)
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Temporary Dashboard placeholders
const CustomerDashboard = () => (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-500">Customer Dashboard</h1>
            <p className="text-text-secondary mt-2">Coming soon in next iteration...</p>
        </div>
    </div>
);

const AdminDashboard = () => (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-500">Admin Dashboard</h1>
            <p className="text-text-secondary mt-2">Coming soon in next iteration...</p>
        </div>
    </div>
);

const StaffDashboard = () => (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-500">Staff Dashboard</h1>
            <p className="text-text-secondary mt-2">Coming soon in next iteration...</p>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* ═══ Public Routes ═══ */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password/:token"
                element={
                    <PublicRoute>
                        <ResetPasswordPage />
                    </PublicRoute>
                }
            />

            {/* ═══ Customer Routes ═══ */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ═══ Admin Routes ═══ */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ═══ Staff Routes ═══ */}
            <Route
                path="/staff/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ═══ Error Routes ═══ */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ═══ Default Redirect ═══ */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;