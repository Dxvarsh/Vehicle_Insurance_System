import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import ProfilePage from '../pages/customer/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import CustomerListPage from '../pages/admin/CustomerListPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import RegisterCustomerPage from '../pages/admin/RegisterCustomerPage';

// Staff Pages
import StaffDashboardPage from '../pages/staff/StaffDashboardPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ═══════════════════════════════════════════ */}
            {/*              PUBLIC ROUTES                  */}
            {/* ═══════════════════════════════════════════ */}
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

            {/* ═══════════════════════════════════════════ */}
            {/*           CUSTOMER ROUTES                   */}
            {/* ═══════════════════════════════════════════ */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                        <DashboardLayout>
                            <CustomerDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
                        <DashboardLayout>
                            <ProfilePage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* ═══════════════════════════════════════════ */}
            {/*             ADMIN ROUTES                    */}
            {/* ═══════════════════════════════════════════ */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <DashboardLayout>
                            <AdminDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/customers"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <DashboardLayout>
                            <CustomerListPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/customers/new"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <DashboardLayout>
                            <RegisterCustomerPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/customers/:id"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <DashboardLayout>
                            <CustomerDetailPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* ═══════════════════════════════════════════ */}
            {/*             STAFF ROUTES                    */}
            {/* ═══════════════════════════════════════════ */}
            <Route
                path="/staff/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                        <DashboardLayout>
                            <StaffDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff/customers"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                        <DashboardLayout>
                            <CustomerListPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff/customers/new"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                        <DashboardLayout>
                            <RegisterCustomerPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/staff/customers/:id"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                        <DashboardLayout>
                            <CustomerDetailPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* ═══════════════════════════════════════════ */}
            {/*             ERROR ROUTES                    */}
            {/* ═══════════════════════════════════════════ */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* ═══════════════════════════════════════════ */}
            {/*           DEFAULT REDIRECT                  */}
            {/* ═══════════════════════════════════════════ */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;